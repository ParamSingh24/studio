import type { AppFile } from '@/lib/types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { CategoryIcons } from './icons';
import { Trash2, Check, Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from './ui/badge';
import { useEffect, useState } from 'react';

interface FileCardProps {
  file: AppFile;
  onDelete: (fileId: string) => void;
  isRecommendedToKeep?: boolean;
}

export default function FileCard({ file, onDelete, isRecommendedToKeep = false }: FileCardProps) {
  const [lastModifiedText, setLastModifiedText] = useState('');

  useEffect(() => {
    // This hook ensures that date formatting only runs on the client, preventing hydration mismatches.
    setLastModifiedText(formatDistanceToNow(file.lastModified, { addSuffix: true }));
  }, [file.lastModified]);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const Icon = CategoryIcons[file.category] || CategoryIcons.Other;

  return (
    <div className={`relative p-3 rounded-lg border transition-all ${isRecommendedToKeep ? 'bg-green-500/10 border-green-500/50' : 'bg-muted/50'}`}>
        {isRecommendedToKeep && (
            <Badge variant="default" className="absolute -top-2 -right-2 bg-green-600 text-white">
                <Star className="w-3 h-3 mr-1" />
                Recommended
            </Badge>
        )}
        <div className="flex items-center gap-4">
            <Icon className="h-8 w-8 text-primary shrink-0" />
            <div className="flex-grow overflow-hidden">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground truncate" title={file.path}>{file.path}</p>
                <div className="text-xs text-muted-foreground mt-1">
                <span>{formatBytes(file.size)}</span>
                <span className="mx-1">·</span>
                {lastModifiedText ? <span>{lastModifiedText}</span> : <span className="w-24 h-4 inline-block bg-muted rounded animate-pulse" />}
                </div>
            </div>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0" onClick={() => onDelete(file.id)}>
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    </div>
  );
}
