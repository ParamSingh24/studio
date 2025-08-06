'use server';

/**
 * @fileOverview This file defines a Genkit flow for natural language search of duplicate files.
 *
 * The flow takes a natural language query as input and returns a structured search filter.
 * - naturalLanguageSearch - A function that handles the natural language search process.
 * - NaturalLanguageSearchInput - The input type for the naturalLanguageSearch function.
 * - NaturalLanguageSearchOutput - The return type for the naturalLanguageSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {allCategories} from '@/lib/mock-data';

const NaturalLanguageSearchInputSchema = z.object({
  query: z.string().describe('The natural language search query.'),
});
export type NaturalLanguageSearchInput = z.infer<
  typeof NaturalLanguageSearchInputSchema
>;

const NaturalLanguageSearchOutputSchema = z.object({
  categories: z
    .array(z.enum(allCategories))
    .optional()
    .describe('A list of file categories to filter by.'),
  sizeGreaterThan: z.number().optional().describe('Filter for files larger than this size in bytes.'),
  sizeLessThan: z.number().optional().describe('Filter for files smaller than this size in bytes.'),
  fileNameContains: z.string().optional().describe('Filter for files whose names contain this substring.'),
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
  prompt: `You are an expert in parsing natural language search queries into structured data.

You will receive a query from the user. Your task is to parse it and extract filtering criteria.

Possible file categories are: ${allCategories.join(', ')}.

If the query mentions a size, convert it to bytes (e.g., 1GB = 1073741824 bytes, 500MB = 524288000 bytes).

Query: {{{query}}}

Return a JSON object with the extracted filters. For example:
- "Show me all games taking up more than 1GB" -> { "categories": ["Games"], "sizeGreaterThan": 1073741824 }
- "Find Adobe software duplicates" -> { "fileNameContains": "Adobe" }
- "What can I safely remove to save 5GB?" -> { "sizeGreaterThan": 5368709120 }
- "media files under 100MB" -> { "categories": ["Media"], "sizeLessThan": 104857600 }
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
