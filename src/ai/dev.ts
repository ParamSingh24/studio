import { config } from 'dotenv';
config();

import '@/ai/flows/natural-language-search.ts';
import '@/ai/flows/recommend-cleanup.ts';
import '@/ai/flows/categorize-files.ts';