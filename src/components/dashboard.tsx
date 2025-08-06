'use client';

import { useState, useEffect } from 'react';
import FileUploadZone from './file-upload-zone';
import ScanProgressView from './scan-progress-view';
import ResultsView from './results-view';
import type { DuplicateGroup } from '@/lib/types';
import { mockDuplicateGroups } from '@/lib/mock-data';

type AppState = 'idle' | 'scanning' | 'results';

export default function Dashboard() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [duplicates, setDuplicates] = useState<DuplicateGroup[]>([]);
  const [progress, setProgress] = useState(0);

  const handleScanStart = () => {
    setAppState('scanning');
    setProgress(0);
  };
  
  const handleReset = () => {
    setDuplicates([]);
    setAppState('idle');
    setProgress(0);
  }

  useEffect(() => {
    if (appState === 'scanning') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setDuplicates(mockDuplicateGroups);
            setAppState('results');
            return 100;
          }
          return prev + 1;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [appState]);

  return (
    <div className="w-full">
      {appState === 'idle' && <FileUploadZone onScanStart={handleScanStart} />}
      {appState === 'scanning' && <ScanProgressView progress={progress} />}
      {appState === 'results' && <ResultsView duplicateGroups={duplicates} onReset={handleReset} />}
    </div>
  );
}
