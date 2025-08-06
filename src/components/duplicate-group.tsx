'use client';

import { useState } from 'react';
import type { DuplicateGroup } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import FileCard from './file-card';
import { getCleanupRecommendation } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Trash2, CheckCircle, HelpCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Skeleton } from './ui/skeleton';

interface DuplicateGroupCardProps {
  group: DuplicateGroup;
  onGroupDeleted: (hash: string) => void;
}

export default function DuplicateGroupCard({ group, onGroupDeleted }: DuplicateGroupCardProps) {
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deletedFiles, setDeletedFiles] = useState<string[]>([]);
  const [recommendedToKeep, setRecommendedToKeep] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGetRecommendation = async () => {
    setIsLoading(true);
    setRecommendation(null);
    try {
      if (group.files.length < 2) {
          setRecommendation("Not enough files to compare.");
          return;
      }
      const res = await getCleanupRecommendation(group.files[0], group.files[1]);
      setRecommendation(res.recommendation);

      const keepMatch = res.recommendation.match(/keep `([^`]+)`/);
      if(keepMatch && keepMatch[1]) {
        const fileToKeep = group.files.find(f => f.name === keepMatch[1]);
        if(fileToKeep) {
            setRecommendedToKeep(fileToKeep.id);
        }
      }

    } catch (error) {
      setRecommendation('Could not get a recommendation at this time.');
      toast({
        title: 'Error',
        description: 'Failed to get AI recommendation.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileDelete = (fileId: string) => {
    setDeletedFiles(prev => [...prev, fileId]);
    const file = group.files.find(f => f.id === fileId);
    toast({
      title: `Deleted "${file?.name}"`,
      description: 'The file has been moved to the trash.',
      action: (
        <Button variant="secondary" size="sm" onClick={() => handleUndoDelete(fileId)}>
          Undo
        </Button>
      ),
    });
  };
  
  const handleUndoDelete = (fileId: string) => {
    setDeletedFiles(prev => prev.filter(id => id !== fileId));
  }

  const handleDeleteAllButOne = () => {
    if (!recommendedToKeep) {
      toast({
          title: "No Recommendation",
          description: "Please get an AI recommendation first to use Smart Clean.",
          variant: 'destructive',
      });
      return;
    }
    const filesToDelete = group.files.filter(f => f.id !== recommendedToKeep);
    setDeletedFiles(filesToDelete.map(f => f.id));
    toast({
        title: 'Smart Clean Complete',
        description: `Kept the recommended file and removed ${filesToDelete.length} duplicates.`,
    });
    // This is where you might mark the whole group as resolved
    setTimeout(() => onGroupDeleted(group.hash), 500);
  }

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const remainingFiles = group.files.filter(f => !deletedFiles.includes(f.id));

  if (remainingFiles.length <= 1) {
    return null; // or some "resolved" state
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="truncate text-lg">Duplicate: {group.files[0].name}</CardTitle>
        <CardDescription>
          Found {group.files.length} copies, taking up {formatBytes(group.totalSize)}.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="space-y-2">
            {remainingFiles.map(file => (
                <FileCard 
                    key={file.id} 
                    file={file} 
                    onDelete={handleFileDelete}
                    isRecommendedToKeep={file.id === recommendedToKeep}
                />
            ))}
        </div>
        
        <div className="space-y-2">
            <Button onClick={handleGetRecommendation} disabled={isLoading} className="w-full" variant="outline">
                <Sparkles className="mr-2 h-4 w-4" />
                {isLoading ? "Thinking..." : "Get AI Suggestion"}
            </Button>
            {isLoading && <Skeleton className="h-24 w-full" />}
            {recommendation && (
                <Alert className={recommendedToKeep ? "border-green-500/50" : ""}>
                    {recommendedToKeep ? <CheckCircle className="h-4 w-4 text-green-500" /> : <HelpCircle className="h-4 w-4" />}
                    <AlertTitle>{recommendedToKeep ? "AI Recommendation" : "Suggestion"}</AlertTitle>
                    <AlertDescription>{recommendation}</AlertDescription>
                </Alert>
            )}
        </div>
      </CardContent>
      {recommendation && recommendedToKeep && (
         <div className="p-6 pt-0">
            <Button onClick={handleDeleteAllButOne} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                <Trash2 className="mr-2 h-4 w-4" />
                Smart Clean
            </Button>
         </div>
      )}
    </Card>
  );
}
