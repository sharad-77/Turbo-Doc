'use client';

import { useMemo, useState } from 'react';
import {
  useDeleteFileMutation,
  useDashboardStatsQuery,
  useFilesQuery,
  useUserPlanQuery,
} from '@/api';
import type { FileItem } from '@/types';

export function useStorage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: files = [], isLoading: filesLoading } = useFilesQuery();
  const { data: stats, isLoading: statsLoading } = useDashboardStatsQuery();
  const { data: userPlan, isLoading: planLoading } = useUserPlanQuery();
  const deleteMutation = useDeleteFileMutation();

  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) return files;
    const query = searchQuery.toLowerCase();
    return files.filter((file: FileItem) => file.name.toLowerCase().includes(query));
  }, [files, searchQuery]);

  const totalStorageBytes = stats?.storageUsed || 0;
  const totalStorageGB = (totalStorageBytes / 1024 ** 3).toFixed(2);
  const totalFileCount = files.length;
  const maxStorageMB = userPlan?.storageLimitMB || 200;
  const maxStorageGBNum = maxStorageMB / 1024;
  const maxStorageGB = maxStorageGBNum.toFixed(2);
  const storagePercentage = Math.min((parseFloat(totalStorageGB) / maxStorageGBNum) * 100, 100);
  const availableStorageGB = Math.max(maxStorageGBNum - parseFloat(totalStorageGB), 0).toFixed(2);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / k ** i).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDelete = (file: FileItem) => {
    if (confirm(`Are you sure you want to delete ${file.name}?`)) {
      deleteMutation.mutate({ id: file.id, type: file.type });
    }
  };

  return {
    state: {
      searchQuery,
      filteredFiles,
      totalStorageGB,
      maxStorageGB,
      totalFileCount,
      storagePercentage,
      availableStorageGB,
      filesLoading: filesLoading || statsLoading || planLoading,
      isLoading: filesLoading || statsLoading || planLoading,
      isDeleting: deleteMutation.isPending,
    },
    actions: {
      setSearchQuery,
      handleDelete,
      formatFileSize,
    },
  };
}
