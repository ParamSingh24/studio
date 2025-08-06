'use server';

import { recommendCleanup } from '@/ai/flows/recommend-cleanup';
import type { AppFile } from '@/lib/types';

export async function getCleanupRecommendation(files: AppFile[]) {
  if (files.length < 2) {
    throw new Error("Need at least two files to compare.");
  }
  // In a real app, you would get more detailed file descriptions.
  const fileInfos = files.map(file => ({
    name: file.name,
    path: file.path,
    size: file.size,
    lastModified: file.lastModified.toISOString(),
  }));


  // Simple mock logic for demonstration without hitting real API in UI-only mode
  if (process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_USE_MOCKS === 'true') {
      const sortedFiles = [...files].sort((a,b) => b.lastModified.getTime() - a.lastModified.getTime());
      const fileToKeep = sortedFiles[0];

      const recommendation = `I recommend you keep \`${fileToKeep.name}\` because it was modified more recently.`;
      
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      
      return {
          recommendation,
          confidenceScore: 0.85,
          fileToKeep: {
            name: fileToKeep.name,
            path: fileToKeep.path,
            size: fileToKeep.size,
            lastModified: fileToKeep.lastModified.toISOString(),
          }
      };
  }
  
  const result = await recommendCleanup({ files: fileInfos });
  return result;
}
