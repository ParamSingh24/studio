'use client';

import { CloudUpload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadZoneProps {
  onScanStart: () => void;
}

export default function FileUploadZone({ onScanStart }: FileUploadZoneProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-10 md:p-20 border-2 border-dashed border-primary/20 rounded-lg bg-card shadow-sm transition-all hover:border-primary/40 hover:bg-primary/5">
      <CloudUpload className="w-16 h-16 text-primary/50 mb-4" />
      <h2 className="text-2xl font-bold text-foreground mb-2">Drop Files to Start Cleaning</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Drag and drop your files or folders here. CleanSweep AI will intelligently scan for duplicates and categorize them for you.
      </p>
      <Button size="lg" onClick={onScanStart}>
        Or Select Files
      </Button>
    </div>
  );
}
