'use client';

import { useMemo } from 'react';
import {
  useDashboardStatsQuery,
  usePlanByNameQuery,
  useRecentFilesQuery,
  useUserPlanQuery,
} from '@/api';
import { useAuthStore } from '@/store/useAuthStore';
import type { FileItem, FileType } from '@/types';

export interface RecentConversion {
  id: string;
  filename: string;
  type: string;
  status: string;
  time: string;
  size: string;
  fileType: FileType;
}

export function useDashboard() {
  const { user } = useAuthStore();
  const { data: stats, isLoading: statsLoading, error } = useDashboardStatsQuery();
  const { data: userPlan, isLoading: planLoading } = useUserPlanQuery();
  const { data: proPlan } = usePlanByNameQuery('PRO', {
    enabled: userPlan?.name !== 'PRO',
  });
  const { data: recentFiles = [], isLoading: filesLoading } = useRecentFilesQuery(10);

  const formatStorage = (bytes: number): number => {
    return Number((bytes / (1024 * 1024 * 1024)).toFixed(2));
  };

  function formatTimeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  const storageLimitGB = userPlan ? userPlan.storageLimitMB / 1024 : 10;
  const storageUsedGB = stats ? formatStorage(stats.storageUsed) : 0;
  const storageRemainingGB = Math.max(0, Number((storageLimitGB - storageUsedGB).toFixed(2)));
  const storagePercentage = storageLimitGB > 0 ? (storageUsedGB / storageLimitGB) * 100 : 0;

  const weeklyGraph = stats?.weeklyGraph;
  const maxConversions = useMemo(() => {
    if (!weeklyGraph || weeklyGraph.length === 0) return 1;
    return Math.max(...weeklyGraph.map(d => d.conversions), 1);
  }, [weeklyGraph]);

  const recentConversions = useMemo(() => {
    return recentFiles.map((file: FileItem) => ({
      id: file.id,
      filename: file.name,
      type: file.type === 'document' ? 'Document' : 'Image',
      status: 'completed',
      time: formatTimeAgo(file.createdAt),
      size: formatFileSize(file.size),
      fileType: file.type,
    }));
  }, [recentFiles]);

  const userName = user?.name || user?.email?.split('@')[0] || 'User';

  return {
    state: {
      userName,
      stats,
      userPlan,
      proPlan,
      recentConversions,
      maxConversions,
      storageUsedGB,
      storageLimitGB,
      storageRemainingGB,
      storagePercentage,
      isLoading: statsLoading || planLoading || filesLoading,
      error,
    },
    actions: {},
  };
}
