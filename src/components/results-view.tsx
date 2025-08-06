'use client';

import { useState } from 'react';
import type { DuplicateGroup, Category } from '@/lib/types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import DuplicateGroupCard from './duplicate-group';
import { allCategories } from '@/lib/mock-data';
import { ListFilter, Search, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ResultsViewProps {
  duplicateGroups: DuplicateGroup[];
  onReset: () => void;
}

export default function ResultsView({ duplicateGroups, onReset }: ResultsViewProps) {
  const [activeFilters, setActiveFilters] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletedGroups, setDeletedGroups] = useState<string[]>([]);

  const totalDuplicates = duplicateGroups.reduce((sum, group) => sum + group.files.length, 0);
  const totalSize = duplicateGroups.reduce((sum, group) => sum + group.totalSize, 0);

  const toggleFilter = (category: Category) => {
    setActiveFilters(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const filteredGroups = duplicateGroups
    .filter(group => !deletedGroups.includes(group.hash))
    .filter(group => {
    const searchMatch = searchTerm === '' || group.files.some(file => file.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const categoryMatch = activeFilters.length === 0 || group.files.some(file => activeFilters.includes(file.category));
    return searchMatch && categoryMatch;
  });

  const handleGroupDeleted = (hash: string) => {
    setDeletedGroups(prev => [...prev, hash]);
  };
  
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Scan Results</h1>
          <p className="text-muted-foreground">
            Found <span className="text-primary font-semibold">{formatBytes(totalSize)}</span> of duplicates in <span className="text-primary font-semibold">{totalDuplicates} files</span>.
          </p>
        </div>
        <Button onClick={onReset} variant="outline">Start New Scan</Button>
      </div>

      <div className="p-4 bg-card rounded-lg border space-y-4">
        <div className="flex flex-wrap gap-4">
            <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    placeholder="Search by file name..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <ListFilter className="h-5 w-5" />
                <span>Filter by category:</span>
            </div>
        </div>
        <div className="flex flex-wrap gap-2">
            {allCategories.map(category => (
                <Badge
                    key={category}
                    variant={activeFilters.includes(category) ? 'default' : 'secondary'}
                    onClick={() => toggleFilter(category)}
                    className="cursor-pointer transition-all"
                >
                    {category}
                </Badge>
            ))}
            {activeFilters.length > 0 && (
                <Button variant="ghost" size="sm" onClick={() => setActiveFilters([])}>
                    <X className="w-4 h-4 mr-1"/>
                    Clear filters
                </Button>
            )}
        </div>
      </div>
      
      {filteredGroups.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {filteredGroups.map(group => (
                <DuplicateGroupCard key={group.hash} group={group} onGroupDeleted={handleGroupDeleted} />
            ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card rounded-lg border">
            <p className="text-lg text-muted-foreground">No duplicates found matching your criteria.</p>
        </div>
      )}

    </div>
  );
}
