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

const RecommendCleanupInputSchema = z.object({
  file1Description: z.string().describe('Description of the first file, including its name, type, and modification date.'),
  file2Description: z.string().describe('Description of the second file, including its name, type, and modification date.'),
});
export type RecommendCleanupInput = z.infer<typeof RecommendCleanupInputSchema>;

const RecommendCleanupOutputSchema = z.object({
  recommendation: z.string().describe('AI recommendation on which file to keep or remove and why.'),
  confidenceScore: z.number().describe('A score between 0 and 1 indicating the confidence in the recommendation.'),
});
export type RecommendCleanupOutput = z.infer<typeof RecommendCleanupOutputSchema>;

export async function recommendCleanup(input: RecommendCleanupInput): Promise<RecommendCleanupOutput> {
  return recommendCleanupFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendCleanupPrompt',
  input: {schema: RecommendCleanupInputSchema},
  output: {schema: RecommendCleanupOutputSchema},
  prompt: `You are an AI assistant that recommends which of two duplicate files a user should keep or remove.

  Provide a recommendation based on the file descriptions, and provide a confidence score between 0 and 1.

  File 1: {{{file1Description}}}
  File 2: {{{file2Description}}}

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
