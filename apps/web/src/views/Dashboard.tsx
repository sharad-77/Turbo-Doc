'use client';

import { useDashboardStats } from '@/api';
import { FileItem, getRecentFiles } from '@/api/files';
import { getPlanByName, getUserPlan, SubscriptionPlan } from '@/api/plans';
import { useAuthStore } from '@/store/useAuthStore';
import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Progress } from '@repo/ui/components/ui/progress';
import { Skeleton } from '@repo/ui/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import {
    Calendar,
    Clock,
    Crown,
    Download,
    FileImage,
    FileText,
    Inbox,
    Plus,
    TrendingDown,
    TrendingUp,
    Upload,
} from 'lucide-react';
import Link from 'next/link';

const Dashboard = () => {
  const { data: stats, isLoading, error } = useDashboardStats();
  const { user } = useAuthStore();

  // Fetch user plan to get storage limit
  const { data: userPlan } = useQuery<SubscriptionPlan>({
    queryKey: ['user-plan'],
    queryFn: getUserPlan,
  });

  // Fetch PRO plan features for upgrade CTA
  const { data: proPlan } = useQuery<SubscriptionPlan>({
    queryKey: ['pro-plan'],
    queryFn: () => getPlanByName('PRO'),
    enabled: userPlan?.name !== 'PRO', // Only fetch if user is not PRO
  });

  // Fetch recent files
  const { data: recentFiles = [] } = useQuery<FileItem[]>({
    queryKey: ['recent-files'],
    queryFn: () => getRecentFiles(10), // Get last 10 files
    staleTime: 10000, // Cache for 10 seconds (shorter for better UX)
    refetchOnWindowFocus: true,
  });

  // Convert bytes to GB
  const formatStorage = (bytes: number): number => {
    return Number((bytes / (1024 * 1024 * 1024)).toFixed(2));
  };

  // Get storage limit from user plan (convert MB to GB)
  const storageLimitGB = userPlan ? userPlan.storageLimitMB / 1024 : 10; // Fallback to 10GB
  const storageUsedGB = stats ? formatStorage(stats.storageUsed) : 0;

  // Calculate max conversions for chart
  const maxConversions = stats?.weeklyGraph
    ? Math.max(...stats.weeklyGraph.map(d => d.conversions), 1)
    : 1;

  // Recent conversions - Fetched from API
  const recentConversions = recentFiles.map(file => ({
    id: file.id,
    filename: file.name, // Backend returns "name"
    type: file.type === 'document' ? 'Document' : 'Image',
    status: 'completed',
    time: formatTimeAgo(file.createdAt),
    size: formatFileSize(file.size), // Backend returns "size"
    fileType: file.type,
  }));

  // Format time ago
  function formatTimeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }

  // Format file size
  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-destructive">Failed to load dashboard data</p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  // Use actual name if available, fallback to email prefix
  const userName = user?.name || user?.email?.split('@')[0] || 'User';

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-space-grotesk font-bold mb-2">Welcome back, {userName}</h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your documents today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s Conversions</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayConversions}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              {stats.growthPercentage >= 0 ? (
                <>
                  <TrendingUp className="inline w-3 h-3 mr-1" />+{stats.growthPercentage.toFixed(1)}
                  % from yesterday
                </>
              ) : (
                <>
                  <TrendingDown className="inline w-3 h-3 mr-1" />
                  {stats.growthPercentage.toFixed(1)}% from yesterday
                </>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFiles.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time conversions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{storageUsedGB} GB</div>
            <Progress
              value={storageLimitGB > 0 ? (storageUsedGB / storageLimitGB) * 100 : 0}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {Math.max(0, Number((storageLimitGB - storageUsedGB).toFixed(2)))} GB remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.growthPercentage >= 0 ? '+' : ''}
              {stats.growthPercentage.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Daily growth percentage</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Usage Chart */}
        <Card
          className={`modern-card ${userPlan?.name === 'PRO' ? 'lg:col-span-3' : 'lg:col-span-2'}`}
        >
          <CardHeader>
            <CardTitle>Weekly Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.weeklyGraph.map((data, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-12 text-sm text-muted-foreground">{data.name}</div>
                  <div className="flex-1">
                    <div className="h-8 bg-primary/20 rounded-lg relative overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-lg transition-all duration-500"
                        style={{
                          width: `${(data.conversions / maxConversions) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-12 text-sm font-medium text-right">{data.conversions}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upgrade CTA - Only show for FREE users */}
        {userPlan?.name !== 'PRO' && (
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-warning" />
                Upgrade to Pro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {proPlan?.description || 'Unlock unlimited conversions and advanced features.'}
              </p>

              <div className="space-y-3">
                {proPlan?.features && proPlan.features.length > 0 ? (
                  proPlan.features.slice(0, 4).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-success rounded-full" />
                      {feature}
                    </div>
                  ))
                ) : (
                  // Fallback features if not available from backend
                  <>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-success rounded-full" />
                      Unlimited file conversions
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-success rounded-full" />
                      Priority processing
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-success rounded-full" />
                      Advanced file formats
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-success rounded-full" />
                      API access
                    </div>
                  </>
                )}
              </div>

              <Button className="w-full" asChild>
                <Link href="/pricing">Upgrade Now</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Conversions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Conversions</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/convert">
                <Plus className="w-4 h-4 mr-2" />
                New
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentConversions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Inbox className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No recent conversions</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Start converting your first document or image
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" asChild>
                    <Link href="/convert">
                      <FileText className="w-4 h-4 mr-2" />
                      Convert Document
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/image-resolution">
                      <Upload className="w-4 h-4 mr-2" />
                      Process Image
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              recentConversions.map(conversion => (
                <div
                  key={conversion.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-accent hover:bg-accent/80 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      {conversion.fileType === 'image' ? (
                        <FileImage className="w-6 h-6 text-primary" />
                      ) : (
                        <FileText className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">{conversion.filename}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{conversion.type}</span>
                        <span>•</span>
                        <span>{conversion.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <Badge variant={conversion.status === 'completed' ? 'default' : 'secondary'} className="mb-1">
                        {conversion.status}
                      </Badge>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {conversion.time}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
