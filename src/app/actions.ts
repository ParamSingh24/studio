
'use server';

import { recommendCleanup, RecommendCleanupInput } from '@/ai/flows/recommend-cleanup';
import type { AppFile } from '@/lib/types';
import {z} from 'genkit/zod';

export async function getCleanupRecommendation(files: AppFile[]) {
  if (files.length < 2) {
    throw new Error("Need at least two files to compare.");
  }
  
  const fileInfos = files.map(file => ({
    name: file.name,
    path: file.path,
    size: file.size,
    lastModified: file.lastModified.toISOString(),
  }));

  const result = await recommendCleanup({ files: fileInfos });
  return result;
}
