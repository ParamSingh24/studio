
'use client';

import { useState, useEffect, useCallback } from 'react';
import FileUploadZone from './file-upload-zone';
import ScanProgressView from './scan-progress-view';
import ResultsView from './results-view';
import type { AppFile, DuplicateGroup } from '@/lib/types';
import { mockDuplicateGroups } from '@/lib/mock-data';
import { categorizeFiles } from '@/ai/flows/categorize-files';
import { useToast } from '@/hooks/use-toast';

type AppState = 'idle' | 'scanning' | 'results';

// Helper function to create mock file hashes
const getFileHash = (file: File) => {
  // In a real app, this would be a proper hash like SHA-256
  return `mock-hash-${file.name}-${file.size}-${file.lastModified}`;
};

export default function DuplicatesDashboard() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [duplicates, setDuplicates] = useState<DuplicateGroup[]>([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState('Initializing scan...');
  const { toast } = useToast();

  const handleScanStart = useCallback(async (files: File[]) => {
    if (files.length === 0) {
        toast({
            title: "No files selected",
            description: "Please select files to scan.",
            variant: "destructive"
        });
      return;
    }

    setAppState('scanning');
    setScanProgress(0);
    setScanStatus('Preparing files...');

    // 1. Prepare file metadata
    const filesToCategorize = files.map(file => ({
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      filePath: (file as any).webkitRelativePath || file.name,
    }));
    
    await new Promise(res => setTimeout(res, 500));
    setScanProgress(20);
    setScanStatus('Categorizing files with AI...');

    try {
      // 2. Categorize files with AI
      const categorizedFiles = await categorizeFiles(filesToCategorize);

      setScanProgress(60);
      setScanStatus('Identifying duplicates...');
      
      const fileMapWithCategory = new Map(categorizedFiles.map(f => [f.fileName, f.category]));
      
      // 3. Process and group duplicates (mock logic)
      const duplicateGroups: Record<string, AppFile[]> = {};
      files.forEach((file, index) => {
          const hash = getFileHash(file);
          const category = fileMapWithCategory.get(file.name) || 'Other';
          const appFile: AppFile = {
              id: `file-${Date.now()}-${index}`,
              name: file.name,
              path: (file as any).webkitRelativePath || file.name,
              size: file.size,
              type: file.type,
              lastModified: new Date(file.lastModified),
              hash: hash,
              category: category,
          };
          
          if (!duplicateGroups[hash]) {
              duplicateGroups[hash] = [];
          }
          duplicateGroups[hash].push(appFile);
      });
      
      await new Promise(res => setTimeout(res, 1000));
      setScanProgress(90);
      setScanStatus('Finalizing results...');

      const finalGroups = Object.values(duplicateGroups)
        .filter(group => group.length > 1)
        .map((files): DuplicateGroup => ({
            hash: files[0].hash,
            files,
            totalSize: files.reduce((sum, file) => sum + file.size, 0)
        }));

      setDuplicates(finalGroups);
      
      await new Promise(res => setTimeout(res, 500));
      setScanProgress(100);
      setAppState('results');

    } catch (error) {
        console.error("Error during scan:", error);
        toast({
            title: "Scan Failed",
            description: "Could not complete the AI-powered scan. Please try again.",
            variant: "destructive"
        });
        setAppState('idle');
    }
  }, [toast]);
  
  const handleReset = () => {
    setDuplicates([]);
    setAppState('idle');
    setScanProgress(0);
  }

  return (
    <div className="w-full py-6">
      {appState === 'idle' && <FileUploadZone onScanStart={handleScanStart} />}
      {appState === 'scanning' && <ScanProgressView progress={scanProgress} status={scanStatus} />}
      {appState === 'results' && <ResultsView duplicateGroups={duplicates} onReset={handleReset} />}
    </div>
  );
}
