'use client';

import { changePassword, getProfile, updateEmail } from '@/api/profile';
import { Alert, AlertDescription } from '@repo/ui/components/ui/alert';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, Download, Key, Loader2, Mail, Save, Shield, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const Settings = () => {
  const queryClient = useQueryClient();

  // Fetch profile to check OAuth status
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  // Form states
  const [emailData, setEmailData] = useState({ newEmail: '' });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Check if user has credential account or only OAuth
  const hasCredentialAccount = profile?.accounts?.some(acc => acc.providerId === 'credential');
  const isOAuthOnly = !hasCredentialAccount && (profile?.accounts?.length || 0) > 0;
  const oauthProvider = profile?.accounts?.find(acc => acc.providerId !== 'credential')?.providerId;

  // Email update mutation
  const emailMutation = useMutation({
    mutationFn: updateEmail,
    onSuccess: () => {
      toast.success('Email updated successfully! Please verify your new email.');
      setEmailData({ newEmail: '' });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update email');
    },
  });

  // Password change mutation
  const passwordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to change password');
    },
  });

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailData.newEmail.trim()) {
      toast.error('Please enter a new email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailData.newEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    emailMutation.mutate({ email: emailData.newEmail });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    passwordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-space-grotesk font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        {/* Change Email */}
        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Change Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <Label htmlFor="currentEmail">Current Email</Label>
                <Input
                  id="currentEmail"
                  type="email"
                  value={profile?.email || ''}
                  disabled
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="newEmail">New Email</Label>
                <Input
                  id="newEmail"
                  type="email"
                  value={emailData.newEmail}
                  onChange={e => setEmailData({ newEmail: e.target.value })}
                  placeholder="Enter new email"
                  className="mt-2"
                />
              </div>
              <Button type="submit" variant="hero" disabled={emailMutation.isPending}>
                {emailMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update Email
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card className={`modern-card ${isOAuthOnly ? 'opacity-60' : ''}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isOAuthOnly ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You signed in with{' '}
                  {oauthProvider === 'google'
                    ? 'Google'
                    : oauthProvider === 'github'
                      ? 'GitHub'
                      : 'a social provider'}
                  . Password change is not available for social media accounts.
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={e =>
                      setPasswordData({ ...passwordData, currentPassword: e.target.value })
                    }
                    placeholder="Enter current password"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={e =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                    placeholder="Enter new password"
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">Minimum 8 characters</p>
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={e =>
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                    }
                    placeholder="Confirm new password"
                    className="mt-2"
                  />
                </div>
                <Button type="submit" variant="hero" disabled={passwordMutation.isPending}>
                  {passwordMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Changing...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Password
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Data & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start" disabled>
              <Download className="w-4 h-4 mr-2" />
              Download My Data
            </Button>
            <Button variant="destructive" className="w-full justify-start" disabled>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
            <p className="text-sm text-muted-foreground">These features are coming soon.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
