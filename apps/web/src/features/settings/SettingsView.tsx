'use client';

import { Alert, AlertDescription } from '@repo/ui/components/ui/alert';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { AlertCircle, Download, Key, Loader2, Mail, Save, Shield, Trash2 } from 'lucide-react';
import { useSettings } from './hooks/useSettings';

export function SettingsView() {
  const { state, actions } = useSettings();
  const {
    profile,
    emailData,
    passwordData,
    isOAuthOnly,
    oauthProvider,
    isLoading,
    isUpdatingEmail,
    isChangingPassword,
  } = state;

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
            <form onSubmit={actions.handleEmailSubmit} className="space-y-4">
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
                  onChange={e => actions.setEmailData({ newEmail: e.target.value })}
                  placeholder="Enter new email"
                  className="mt-2"
                  required
                />
              </div>
              <Button type="submit" variant="hero" disabled={isUpdatingEmail}>
                {isUpdatingEmail ? (
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
              <form onSubmit={actions.handlePasswordSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={e =>
                      actions.setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    placeholder="Enter current password"
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={e =>
                      actions.setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    placeholder="Enter new password"
                    className="mt-2"
                    required
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
                      actions.setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="Confirm new password"
                    className="mt-2"
                    required
                  />
                </div>
                <Button type="submit" variant="hero" disabled={isChangingPassword}>
                  {isChangingPassword ? (
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
}
