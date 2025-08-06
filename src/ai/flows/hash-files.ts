'use server';

/**
 * @fileOverview A Genkit flow to compute file hashes and identify duplicates.
 *
 * - hashFiles - A function that takes file data, computes SHA-256 hashes, and returns duplicate groups.
 * - HashFilesInput - The input type for the hashFiles function.
 * - HashFilesOutput - The return type for the hashFiles function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import * as crypto from 'crypto';

const FileInputSchema = z.object({
    fileName: z.string(),
    fileType: z.string(),
    fileSize: z.number(),
    filePath: z.string(),
    // We'll receive the file content as a Base64 string from the client
    content: z.string().describe("Base64 encoded content of the file."),
});

const HashFilesInputSchema = z.array(FileInputSchema);
export type HashFilesInput = z.infer<typeof HashFilesInputSchema>;


const FileOutputSchema = z.object({
    id: z.string(),
    name: z.string(),
    path: z.string(),
    size: z.number(),
    type: z.string(),
    lastModified: z.string(),
    hash: z.string(),
    category: z.string(), // Category will be added in a subsequent step
});


const HashFilesOutputSchema = z.record(z.array(FileOutputSchema));
export type HashFilesOutput = z.infer<typeof HashFilesOutputSchema>;


export async function hashFiles(input: HashFilesInput): Promise<HashFilesOutput> {
  return hashFilesFlow(input);
}

const hashFilesFlow = ai.defineFlow(
  {
    name: 'hashFilesFlow',
    inputSchema: HashFilesInputSchema,
    outputSchema: HashFilesOutputSchema,
  },
  async (files) => {
    const hashMap: Record<string, any[]> = {};

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Decode the Base64 content to a Buffer
        const buffer = Buffer.from(file.content, 'base64');
        
        // Compute the SHA-256 hash
        const hash = crypto.createHash('sha256').update(buffer).digest('hex');

        if (!hashMap[hash]) {
            hashMap[hash] = [];
        }

        const now = new Date();
        const appFile = {
            id: `file-${now.getTime()}-${i}`,
            name: file.fileName,
            path: file.filePath,
            size: file.fileSize,
            type: file.fileType,
            lastModified: now.toISOString(),
            hash: hash,
            category: 'Other', // Default category
        };

        hashMap[hash].push(appFile);
    }
    
    return hashMap;
  }
);
