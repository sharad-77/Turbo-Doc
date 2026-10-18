'use client';

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
  FileImage,
  FileText,
  Inbox,
  Plus,
  TrendingDown,
  TrendingUp,
  Upload,
} from 'lucide-react';
import Link from 'next/link';
import { useDashboard, type RecentConversion } from './hooks/useDashboard';

export function DashboardView() {
  const { state } = useDashboard();
  const {
    userName,
    stats,
    userPlan,
    proPlan,
    recentConversions,
    maxConversions,
    storageUsedGB,
    storageRemainingGB,
    storagePercentage,
    isLoading,
    error,
  } = state;

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
        <p className="text-destructive font-medium">Failed to load dashboard data</p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  if (!stats) return null;

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
                  <TrendingUp className="inline w-3 h-3 mr-1 text-emerald-500" />+
                  {stats.growthPercentage.toFixed(1)}% from yesterday
                </>
              ) : (
                <>
                  <TrendingDown className="inline w-3 h-3 mr-1 text-rose-500" />
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
            <Progress value={storagePercentage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {storageRemainingGB} GB remaining
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

        {/* Upgrade CTA - Only show for non-PRO users */}
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
              recentConversions.map((conversion: RecentConversion) => (
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
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
