
'use client';

import { useState, useCallback } from 'react';
import FileUploadZone from './file-upload-zone';
import ScanProgressView from './scan-progress-view';
import ResultsView from './results-view';
import type { AppFile, DuplicateGroup } from '@/lib/types';
import { categorizeFiles } from '@/ai/flows/categorize-files';
import { hashFiles } from '@/ai/flows/hash-files';
import { useToast } from '@/hooks/use-toast';

type AppState = 'idle' | 'scanning' | 'results';

// Helper to read file content as a Base64 string
const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.result) {
                // result is "data:<mime>;base64,<base64_string>"
                resolve((reader.result as string).split(',')[1]);
            } else {
                reject(new Error("Could not read file."));
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
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

    try {
        // 1. Prepare file metadata and content
        setScanProgress(10);
        setScanStatus('Reading files...');
        const filesToHash = await Promise.all(files.map(async file => ({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          filePath: (file as any).webkitRelativePath || file.name,
          content: await readFileAsBase64(file),
        })));

        // 2. Hash files on the "backend"
        setScanProgress(30);
        setScanStatus('Hashing files to find duplicates...');
        const hashedFileGroups = await hashFiles(filesToHash);
        
        // 3. Filter for actual duplicates and prepare for categorization
        const duplicateFilesForCategorization: { fileName: string, fileType: string, fileSize: number, filePath: string }[] = [];
        const allDuplicateFiles: AppFile[] = [];

        Object.values(hashedFileGroups).forEach(group => {
            if (group.length > 1) {
                group.forEach(file => {
                    allDuplicateFiles.push({ ...file, lastModified: new Date(file.lastModified) });
                    duplicateFilesForCategorization.push({
                        fileName: file.name,
                        fileType: file.type,
                        fileSize: file.size,
                        filePath: file.path,
                    });
                });
            }
        });

        if (duplicateFilesForCategorization.length === 0) {
            setScanProgress(100);
            setScanStatus('No duplicates found.');
            setDuplicates([]);
            setAppState('results');
            return;
        }

        // 4. Categorize the duplicate files with AI
        setScanProgress(60);
        setScanStatus('Categorizing duplicates with AI...');
        const categorizedFiles = await categorizeFiles(duplicateFilesForCategorization);
        const fileCategoryMap = new Map(categorizedFiles.map(f => [f.fileName, f.category]));

        // 5. Update categories in the final file objects
        allDuplicateFiles.forEach(file => {
            file.category = fileCategoryMap.get(file.name) || 'Other';
        });

        // 6. Finalize groups for display
        setScanProgress(90);
        setScanStatus('Finalizing results...');
        const finalGroupsMap: Record<string, AppFile[]> = {};
        allDuplicateFiles.forEach(file => {
            if (!finalGroupsMap[file.hash]) {
                finalGroupsMap[file.hash] = [];
            }
            finalGroupsMap[file.hash].push(file);
        });

        const finalGroups = Object.values(finalGroupsMap)
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
            description: "Could not complete the scan. Please try again.",
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
