'use client';

import { useDashboardStats } from '@/api';
import { useAuthStore } from '@/store/useAuthStore';
import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Progress } from '@repo/ui/components/ui/progress';
import { Skeleton } from '@repo/ui/components/ui/skeleton';
import {
  Calendar,
  Clock,
  Crown,
  Download,
  FileText,
  Filter,
  Plus,
  RotateCcw,
  Save,
  Search,
  TrendingDown,
  TrendingUp,
  Upload,
} from 'lucide-react';
import Link from 'next/link';

const Dashboard = () => {
  const { data: stats, isLoading, error } = useDashboardStats();
  const { user } = useAuthStore();

  // Convert bytes to GB
  const formatStorage = (bytes: number): number => {
    return Number((bytes / (1024 * 1024 * 1024)).toFixed(2));
  };

  // Default storage limit (can be fetched from user plan later)
  const storageLimitGB = 10;
  const storageUsedGB = stats ? formatStorage(stats.storageUsed) : 0;

  // Calculate max conversions for chart
  const maxConversions = stats?.weeklyGraph
    ? Math.max(...stats.weeklyGraph.map(d => d.conversions), 1)
    : 1;

  // Mock recent conversions (can be fetched from API later)
  const recentConversions: Array<{
    id: number;
    filename: string;
    type: string;
    status: string;
    time: string;
    size: string;
  }> = [];

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

  const userName = user?.email?.split('@')[0] || 'User';

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
            <Progress value={(storageUsedGB / storageLimitGB) * 100} className="mt-2" />
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
        <Card className="lg:col-span-2 modern-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Weekly Usage</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
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

        {/* Upgrade CTA */}
        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-warning" />
              Upgrade to Pro
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Unlock unlimited conversions and advanced features.
            </p>

            <div className="space-y-3">
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
            </div>

            <Button className="w-full" asChild>
              <Link href="/pricing">Upgrade Now</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Conversions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Conversions</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/convert">
                  <Plus className="w-4 h-4 mr-2" />
                  New
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentConversions.map(conversion => (
              <div
                key={conversion.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-accent hover:bg-accent/80 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
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
                    <Badge
                      variant={conversion.status === 'completed' ? 'default' : 'secondary'}
                      className="mb-1"
                    >
                      {conversion.status}
                    </Badge>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {conversion.time}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" title="Download">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Convert Again">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Save">
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
