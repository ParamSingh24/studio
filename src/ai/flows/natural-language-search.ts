'use server';

/**
 * @fileOverview This file defines a Genkit flow for natural language search of duplicate files.
 *
 * The flow takes a natural language query as input and returns a list of file categories that match the query.
 * - naturalLanguageSearch - A function that handles the natural language search process.
 * - NaturalLanguageSearchInput - The input type for the naturalLanguageSearch function.
 * - NaturalLanguageSearchOutput - The return type for the naturalLanguageSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NaturalLanguageSearchInputSchema = z.object({
  query: z.string().describe('The natural language search query.'),
});
export type NaturalLanguageSearchInput = z.infer<
  typeof NaturalLanguageSearchInputSchema
>;

const NaturalLanguageSearchOutputSchema = z.object({
  fileCategories: z
    .array(z.string())
    .describe('A list of file categories that match the query.'),
});
export type NaturalLanguageSearchOutput = z.infer<
  typeof NaturalLanguageSearchOutputSchema
>;

export async function naturalLanguageSearch(
  input: NaturalLanguageSearchInput
): Promise<NaturalLanguageSearchOutput> {
  return naturalLanguageSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'naturalLanguageSearchPrompt',
  input: {schema: NaturalLanguageSearchInputSchema},
  output: {schema: NaturalLanguageSearchOutputSchema},
  prompt: `You are an expert in file categorization.

You will receive a natural language search query from the user. Your task is to identify the file categories that best match the query.

Query: {{{query}}}

Return a list of file categories that match the query. The possible file categories are: Games, Productivity, Development, Browsers, Media, Graphics, Security, System Tools.
`,
});

const naturalLanguageSearchFlow = ai.defineFlow(
  {
    name: 'naturalLanguageSearchFlow',
    inputSchema: NaturalLanguageSearchInputSchema,
    outputSchema: NaturalLanguageSearchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
