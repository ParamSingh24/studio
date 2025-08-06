'use server';

/**
 * @fileOverview A file categorization AI agent.
 *
 * - categorizeFiles - A function that handles the file categorization process.
 * - CategorizeFilesInput - The input type for the categorizeFiles function.
 * - CategorizeFilesOutput - The return type for the categorizeFiles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeFilesInputSchema = z.array(
  z.object({
    fileName: z.string().describe('The name of the file.'),
    fileType: z.string().describe('The type of the file (e.g., application/pdf, image/jpeg, etc.).'),
    fileSize: z.number().describe('The size of the file in bytes.'),
    fileHash: z.string().describe('The SHA-256 hash of the file content.'),
  })
).describe('An array of file metadata objects to categorize.');

export type CategorizeFilesInput = z.infer<typeof CategorizeFilesInputSchema>;

const CategorizeFilesOutputSchema = z.array(
  z.object({
    fileName: z.string().describe('The name of the file.'),
    category: z.string().describe('The predicted category of the file (e.g., Games, Productivity, Development, Browsers, Media, Graphics, Security, System Tools).'),
    confidence: z.number().describe('The confidence score (0-1) of the categorization.'),
  })
).describe('An array of file categorization results.');

export type CategorizeFilesOutput = z.infer<typeof CategorizeFilesOutputSchema>;

export async function categorizeFiles(input: CategorizeFilesInput): Promise<CategorizeFilesOutput> {
  return categorizeFilesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeFilesPrompt',
  input: {schema: CategorizeFilesInputSchema},
  output: {schema: CategorizeFilesOutputSchema},
  prompt: `You are an expert file categorization AI.

  Given a list of files with their metadata (name, type, size, hash), you will predict the most appropriate category for each file from the following list:
  Games, Productivity, Development, Browsers, Media, Graphics, Security, System Tools

  Return a JSON array of file categorization results, including the file name, predicted category, and a confidence score (0-1) for the categorization.

  Here is the list of files to categorize:
  {{#each this}}
  - Filename: {{{fileName}}}, File Type: {{{fileType}}}, File Size: {{{fileSize}}} bytes, File Hash: {{{fileHash}}}
  {{/each}}
  `,
});

const categorizeFilesFlow = ai.defineFlow(
  {
    name: 'categorizeFilesFlow',
    inputSchema: CategorizeFilesInputSchema,
    outputSchema: CategorizeFilesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
