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
  newerThan: z.string().optional().describe('Filter for files modified after this date (YYYY-MM-DD).'),
  olderThan: z.string().optional().describe('Filter for files modified before this date (YYYY-MM-DD).'),
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
  prompt: `You are an expert at parsing natural language search queries into structured data for filtering duplicate files.

  Analyze the user's query and extract filtering criteria. The available categories are: ${allCategories.join(', ')}.

  If the query mentions a file size, convert it to bytes (e.g., 1GB = 1073741824, 500MB = 524288000, 10KB = 10240).
  If the query mentions a date, convert it to YYYY-MM-DD format. Assume the current year if not specified.

  Query: {{{query}}}

  Return a JSON object with the extracted filters. Here are some examples:
  - "Show me all games taking up more than 1GB" -> { "categories": ["Games"], "sizeGreaterThan": 1073741824 }
  - "Find Adobe software duplicates" -> { "fileNameContains": "Adobe" }
  - "What can I safely remove to save 5GB?" -> { "sizeGreaterThan": 5368709120 }
  - "media files under 100MB from before last year" -> { "categories": ["Media"], "sizeLessThan": 104857600, "olderThan": "2023-01-01" }
  - "anything created since march" -> { "newerThan": "2024-03-01" }
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
