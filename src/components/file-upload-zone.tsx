
'use client';

import { CloudUpload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadZoneProps {
  onScanStart: (files: File[]) => void;
}

export default function FileUploadZone({ onScanStart }: FileUploadZoneProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setIsUploading(true);
        onScanStart(acceptedFiles);
      }
    },
    [onScanStart]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
        setIsUploading(true);
        onScanStart(Array.from(files));
    }
  };


  return (
    <div
      {...getRootProps()}
      className={`flex flex-col items-center justify-center text-center p-10 md:p-20 border-2 border-dashed  rounded-lg bg-card shadow-sm transition-all ${
        isDragActive ? 'border-primary bg-primary/10' : 'border-primary/20 hover:border-primary/40 hover:bg-primary/5'
      }`}
    >
      <input {...getInputProps()} />
      <CloudUpload className="w-16 h-16 text-primary/50 mb-4" />
      <h2 className="text-2xl font-bold text-foreground mb-2">Drop Files to Start Cleaning</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Drag and drop your files or folders here. CleanSweep AI will intelligently scan for duplicates and categorize them for you.
      </p>
      
      <div className="flex items-center">
        <label htmlFor="file-upload" className="relative cursor-pointer">
            <Button asChild>
                <span>Or Select Files</span>
            </Button>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileSelect} disabled={isUploading} />
        </label>
      </div>

       {isUploading && (
          <p className="mt-4 text-sm text-muted-foreground animate-pulse">
            Processing files...
          </p>
        )}
    </div>
  );
}
