'use client';

import { getDashboardStats } from '@/api/dashboard';
import { getUserPlan } from '@/api/plans';
import { deleteFile, getFiles, type UserFile } from '@/api/profile';
import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Input } from '@repo/ui/components/ui/input';
import { Progress } from '@repo/ui/components/ui/progress';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
import { useState } from 'react';
import { toast } from 'sonner';

const Storage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();

  // Fetch files
  const { data: files = [], isLoading: filesLoading } = useQuery({
    queryKey: ['user-files'],
    queryFn: getFiles,
  });

  // Fetch dashboard stats for storage
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
  });

  // Fetch user plan for storage limit
  const { data: userPlan } = useQuery({
    queryKey: ['user-plan'],
    queryFn: getUserPlan,
  });

  // Delete file mutation
  const deleteMutation = useMutation({
    mutationFn: ({ fileId, fileType }: { fileId: string; fileType: 'document' | 'image' }) =>
      deleteFile(fileId, fileType),
    onSuccess: () => {
      toast.success('File deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['user-files'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
    onError: () => {
      toast.error('Failed to delete file');
    },
  });

  // Filter files based on search
  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate storage stats
  const totalStorageBytes = stats?.storageUsed || 0;
  const totalStorageGB = (totalStorageBytes / 1024 ** 3).toFixed(2);
  const totalFileCount = files.length;
  const maxStorageMB = userPlan?.storageLimitMB || 200; // Default to FREE plan
  const maxStorageGBNum = maxStorageMB / 1024;
  const maxStorageGB = maxStorageGBNum.toFixed(2);

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / k ** i).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle delete
  const handleDelete = (file: UserFile) => {
    if (confirm(`Are you sure you want to delete ${file.name}?`)) {
      deleteMutation.mutate({ fileId: file.id, fileType: file.type });
    }
  };

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
                  {totalStorageGB} GB of {maxStorageGB} GB used
                </span>
                <span className="text-sm text-muted-foreground">{totalFileCount} files</span>
              </div>
              <Progress value={(parseFloat(totalStorageGB) / maxStorageGBNum) * 100} />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {(maxStorageGBNum - parseFloat(totalStorageGB)).toFixed(2)} GB available
              </p>
              <Button variant="outline" size="sm">
                Upgrade Storage
              </Button>
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
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
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
            {filesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery
                    ? 'No files found matching your search'
                    : 'No files yet. Start converting!'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFiles.map(file => (
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
                          <span>{formatFileSize(file.size)}</span>
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
                        onClick={() => handleDelete(file)}
                        disabled={deleteMutation.isPending}
                      >
                        {deleteMutation.isPending ? (
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
};

export default Storage;
