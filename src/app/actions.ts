'use server';

import { recommendCleanup } from '@/ai/flows/recommend-cleanup';
import type { AppFile } from '@/lib/types';

export async function getCleanupRecommendation(file1: AppFile, file2: AppFile) {
  // In a real app, you would get more detailed file descriptions.
  const file1Description = `Name: ${file1.name}, Path: ${file1.path}, Modified: ${file1.lastModified.toISOString()}`;
  const file2Description = `Name: ${file2.name}, Path: ${file2.path}, Modified: ${file2.lastModified.toISOString()}`;

  // Simple mock logic for demonstration without hitting real API in UI-only mode
  if (process.env.NODE_ENV !== 'production') {
      const recommendation = file1.lastModified > file2.lastModified 
          ? `I recommend you keep \`${file1.name}\` because it was modified more recently.`
          : `I recommend you keep \`${file2.name}\` because it was modified more recently.`;
      
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      
      return {
          recommendation,
          confidenceScore: 0.85
      };
  }
  
  const result = await recommendCleanup({ file1Description, file2Description });
  return result;
}
