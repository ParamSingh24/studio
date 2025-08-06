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
    filePath: z.string().describe('The full path of the file.'),
  })
).describe('An array of file metadata objects to categorize.');

export type CategorizeFilesInput = z.infer<typeof CategorizeFilesInputSchema>;

const CategorizeFilesOutputSchema = z.array(
  z.object({
    fileName: z.string().describe('The name of the file.'),
    category: z.enum(["Games", "Productivity", "Development", "Browsers", "Media", "Graphics", "Security", "System Tools", "Other"]).describe('The predicted category of the file.'),
    confidence: z.number().min(0).max(1).describe('The confidence score (0-1) of the categorization.'),
    reasoning: z.string().describe('A brief explanation for the categorization.')
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
  prompt: `You are an expert file categorization AI. Your task is to analyze file metadata and categorize each file into one of the following categories: Games, Productivity, Development, Browsers, Media, Graphics, Security, System Tools, or Other.

  Consider the file name, type, size, and especially its path to make an accurate prediction. For example, a file in a 'Steam' directory is likely a game.

  Return a JSON array of objects. Each object must contain the original file name, its predicted category, a confidence score between 0 and 1, and a brief reasoning for your choice.

  Here is the list of files to categorize:
  {{#each this}}
  - Filename: {{{fileName}}}, Path: {{{filePath}}}, File Type: {{{fileType}}}, File Size: {{{fileSize}}} bytes
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
