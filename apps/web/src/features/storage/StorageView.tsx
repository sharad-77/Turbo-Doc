'use client';

import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Input } from '@repo/ui/components/ui/input';
import { Progress } from '@repo/ui/components/ui/progress';
import { format } from 'date-fns';
import {
  Clock,
  FileText,
  Filter,
  HardDrive,
  Image as ImageIcon,
  Loader2,
  Search,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useStorage } from './hooks/useStorage';
import type { FileItem } from '@/types';

export function StorageView() {
  const { state, actions } = useStorage();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-space-grotesk font-bold mb-2">Storage</h1>
          <p className="text-muted-foreground">Manage your converted files and storage</p>
        </div>

        {/* Storage Stats */}
        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="w-5 h-5" />
              Storage Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">
                  {state.totalStorageGB} GB of {state.maxStorageGB} GB used
                </span>
                <span className="text-sm text-muted-foreground">{state.totalFileCount} files</span>
              </div>
              <Progress value={state.storagePercentage} />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {state.availableStorageGB} GB available
              </p>
              <Link href="/pricing">
                <Button variant="outline" size="sm">
                  Upgrade Storage
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Files List */}
        <Card className="modern-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Your Files</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search files..."
                    value={state.searchQuery}
                    onChange={e => actions.setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {state.isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : state.filteredFiles.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {state.searchQuery
                    ? 'No files found matching your search'
                    : 'No files yet. Start converting!'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {state.filteredFiles.map((file: FileItem) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-accent hover:bg-accent/80 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        {file.type === 'document' ? (
                          <FileText className="w-6 h-6 text-primary" />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-primary" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{file.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{actions.formatFileSize(file.size)}</span>
                          <span>•</span>
                          <Clock className="w-3 h-3" />
                          <span>{format(new Date(file.createdAt), 'MMM dd, yyyy')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{file.format.toUpperCase()}</Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => actions.handleDelete(file)}
                        disabled={state.isDeleting}
                        aria-label={`Delete ${file.name}`}
                      >
                        {state.isDeleting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
