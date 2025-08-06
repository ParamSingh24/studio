'use server';

/**
 * @fileOverview AI-powered recommendations on which duplicate files to keep or remove.
 *
 * - recommendCleanup - A function that provides cleanup recommendations.
 * - RecommendCleanupInput - The input type for the recommendCleanup function.
 * - RecommendCleanupOutput - The return type for the recommendCleanup function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FileInfoSchema = z.object({
  name: z.string().describe('The name of the file.'),
  path: z.string().describe('The installation path of the file.'),
  size: z.number().describe('The size of the file in bytes.'),
  lastModified: z.string().describe('The last modification date in ISO 8601 format.'),
  version: z.string().optional().describe('The file version, if available.'),
});

const RecommendCleanupInputSchema = z.object({
  files: z.array(FileInfoSchema).min(2).describe('An array of two or more duplicate files to compare.'),
});
export type RecommendCleanupInput = z.infer<typeof RecommendCleanupInputSchema>;

const RecommendCleanupOutputSchema = z.object({
  recommendation: z.string().describe('AI recommendation on which file to keep and why.'),
  confidenceScore: z.number().min(0).max(1).describe('A score between 0 and 1 indicating the confidence in the recommendation.'),
  fileToKeep: FileInfoSchema.describe('The file that is recommended to be kept.'),
});
export type RecommendCleanupOutput = z.infer<typeof RecommendCleanupOutputSchema>;

export async function recommendCleanup(input: RecommendCleanupInput): Promise<RecommendCleanupOutput> {
  return recommendCleanupFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendCleanupPrompt',
  input: {schema: RecommendCleanupInputSchema},
  output: {schema: RecommendCleanupOutputSchema},
  prompt: `You are an AI assistant that recommends which of several duplicate files a user should keep.

  Analyze the provided file metadata. Your recommendation should be based on a hierarchy of factors:
  1.  **Version:** A higher version number is almost always better.
  2.  **Path:** "Official" locations (e.g., 'Program Files', '/usr/bin') are preferable to temporary or download folders.
  3.  **Recency:** A more recent 'lastModified' date is generally better.
  4.  **Size:** A larger file might indicate a more complete version, but this is a weak indicator.

  Provide a concise recommendation explaining your reasoning, a confidence score based on the strength of the signals, and explicitly state which file should be kept.

  Files to analyze:
  {{#each files}}
  - Name: {{{name}}}, Path: {{{path}}}, Size: {{{size}}} bytes, Last Modified: {{{lastModified}}}{{#if version}}, Version: {{{version}}}{{/if}}
  {{/each}}

  Recommendation:`,
});

const recommendCleanupFlow = ai.defineFlow(
  {
    name: 'recommendCleanupFlow',
    inputSchema: RecommendCleanupInputSchema,
    outputSchema: RecommendCleanupOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
