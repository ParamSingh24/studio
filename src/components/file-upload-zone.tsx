
'use client';

import { CloudUpload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCallback, useState } from 'react';
import { useDropzone, type DropzoneOptions } from 'react-dropzone';

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
  
  const handleFileSelectFromButton = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
        setIsUploading(true);
        onScanStart(Array.from(files));
    }
  };


  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    noClick: true, // we use a custom button
    noKeyboard: true,
  });

  const getBorderClassName = () => {
    if (isDragAccept) return 'border-green-500 bg-green-500/10';
    if (isDragReject) return 'border-destructive bg-destructive/10';
    if (isDragActive) return 'border-primary bg-primary/10';
    return 'border-primary/20 hover:border-primary/40 hover:bg-primary/5';
  }

  return (
    <div
      {...getRootProps()}
      className={`relative flex flex-col items-center justify-center text-center p-10 md:p-20 border-2 border-dashed rounded-lg bg-card shadow-sm transition-all duration-300 ${getBorderClassName()}`}
    >
      <input {...getInputProps()} />
      <div className="absolute inset-0 bg-transparent" />
      <CloudUpload className="w-16 h-16 text-primary/50 mb-4 transition-transform group-hover:scale-110" />
      <h2 className="text-2xl font-bold text-foreground mb-2">Drop Files to Start Cleaning</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Drag and drop your files or folders here. CleanSweep AI will intelligently scan for duplicates and categorize them for you.
      </p>
      
      <div className="flex items-center gap-4">
        <label htmlFor="file-upload" className="relative cursor-pointer">
            <Button asChild>
                <span>Select Files</span>
            </Button>
            <input 
              id="file-upload" 
              name="file-upload" 
              type="file" 
              className="sr-only" 
              multiple 
              onChange={handleFileSelectFromButton} 
              disabled={isUploading}
            />
        </label>

        <span className="text-muted-foreground">or</span>

        <label htmlFor="folder-upload" className="relative cursor-pointer">
             <Button asChild variant="outline">
                <span>Select Folder</span>
            </Button>
            <input 
              id="folder-upload" 
              name="folder-upload" 
              type="file" 
              className="sr-only" 
              multiple 
              onChange={handleFileSelectFromButton} 
              disabled={isUploading} 
              // The following two attributes are needed for folder uploads
              {...({ webkitdirectory: "true", mozdirectory: "true", directory: "true" } as any)}
            />
        </label>
      </div>

       {isUploading && (
          <p className="mt-4 text-sm text-muted-foreground animate-pulse">
            Processing files... Please wait.
          </p>
        )}
    </div>
  );
}
