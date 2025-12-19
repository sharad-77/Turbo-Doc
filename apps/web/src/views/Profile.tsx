'use client';

import { getDashboardStats, type DashboardStats } from '@/api/dashboard';
import { getUserPlan, type SubscriptionPlan } from '@/api/plans';
import {
    getProfile,
    updateProfile,
    type UpdateProfileRequest,
    type UserProfile,
} from '@/api/profile';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/ui/avatar';
import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Calendar, Check, Crown, Loader2, Save, Upload, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const Profile = () => {
  const queryClient = useQueryClient();

  // Fetch profile
  const { data: profile, isLoading } = useQuery<UserProfile, Error>({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  // Fetch stats
  const { data: stats } = useQuery<DashboardStats, Error>({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
  });

  // Fetch user plan details
  const { data: userPlan } = useQuery<SubscriptionPlan, Error>({
    queryKey: ['user-plan'],
    queryFn: getUserPlan,
  });

  // Form state - initialize with memo to avoid setState in effect
  const initialFormData = {
    name: profile?.name || '',
    email: profile?.email || '',
  };

  const [formData, setFormData] = useState(initialFormData);

  // Reset form when profile changes (using key on form element is better approach)
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]); // Only run when profile ID changes, not on every profile update

  // Update profile mutation
  const updateMutation = useMutation<UserProfile, Error, UpdateProfileRequest>({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success('Profile updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('Email is required');
      return;
    }

    updateMutation.mutate({
      name: formData.name,
      email: formData.email,
    });
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0];
    }
    return name.substring(0, 2);
  };

  // Format storage
  const formatStorage = (bytes: number) => {
    return (bytes / 1024 ** 3).toFixed(2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-muted-foreground">Failed to load profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-space-grotesk font-bold mb-2">Profile</h1>
          <p className="text-muted-foreground">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profile.image || ''} />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {getInitials(profile.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button type="button" variant="outline" size="sm" disabled>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="mt-2"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="mt-2"
                    placeholder="Enter your email"
                  />
                  {!profile.emailVerified && (
                    <p className="text-sm text-orange-500 mt-1">Email not verified</p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                variant="hero"
                className="w-full md:w-auto"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Subscription Card */}
        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5" />
              Subscription
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Current Plan</h3>
                <p className="text-sm text-muted-foreground">
                  {userPlan?.displayName || profile.plan}
                </p>
              </div>
              <Badge variant={userPlan?.name === 'PRO' ? 'default' : 'outline'}>
                {userPlan?.name || profile.plan}
              </Badge>
            </div>

            {/* Plan Features */}
            {userPlan?.features && userPlan.features.length > 0 && (
              <div className="space-y-2 pt-4 border-t">
                <h4 className="text-sm font-medium mb-3">Plan Features:</h4>
                <div className="space-y-2">
                  {userPlan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Member since {format(new Date(profile.createdAt), 'MMMM yyyy')}</span>
            </div>
            {userPlan?.name !== 'PRO' && (
              <Button
                variant="cta"
                className="w-full"
                onClick={() => (window.location.href = '/pricing')}
              >
                Upgrade to Pro
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Account Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="modern-card">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{stats?.totalFiles || 0}</div>
                <p className="text-sm text-muted-foreground">Total Files</p>
              </div>
            </CardContent>
          </Card>
          <Card className="modern-card">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{stats?.todayConversions || 0}</div>
                <p className="text-sm text-muted-foreground">Today&apos;s Conversions</p>
              </div>
            </CardContent>
          </Card>
          <Card className="modern-card">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  {formatStorage(stats?.storageUsed || 0)} GB
                </div>
                <p className="text-sm text-muted-foreground">Storage Used</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
