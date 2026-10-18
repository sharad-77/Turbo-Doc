'use client';

import { Suspense } from 'react';
import { Button } from '@repo/ui/components/ui/button';
import { Card } from '@repo/ui/components/ui/card';
import { Input } from '@repo/ui/components/ui/input';
import { ArrowLeft, CheckCircle, Eye, EyeOff, KeyRound, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useResetPassword } from './hooks/useResetPassword';

function ResetPasswordForm() {
  const { state, actions } = useResetPassword();
  const { token, password, confirmPassword, showPassword, loading, success } = state;

  if (!token) {
    return (
      <Card className="w-full max-w-md p-8 space-y-6 text-center">
        <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <KeyRound className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-space-grotesk font-bold">Invalid Reset Link</h1>
        <p className="text-muted-foreground text-sm">
          This password reset link is missing or invalid. Please request a new link.
        </p>
        <Link href="/forgot-password">
          <Button variant="hero" className="w-full rounded-xl">
            Request New Link
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md p-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          {success ? (
            <CheckCircle className="w-8 h-8 text-primary" />
          ) : (
            <KeyRound className="w-8 h-8 text-primary" />
          )}
        </div>
        <h1 className="text-2xl md:text-3xl font-space-grotesk font-bold">
          {success ? 'Password Reset Complete' : 'Set New Password'}
        </h1>
        <p className="text-muted-foreground text-sm">
          {success
            ? 'Your password has been changed. Redirecting you to sign in...'
            : 'Enter a strong new password for your account.'}
        </p>
      </div>

      {!success ? (
        <form onSubmit={actions.handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="newPassword" className="text-sm font-medium">
              New Password
            </label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 8 characters"
                value={password}
                onChange={e => actions.setPassword(e.target.value)}
                className="pr-10 h-12 rounded-xl"
                disabled={loading}
                required
              />
              <button
                type="button"
                onClick={() => actions.setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm New Password
            </label>
            <Input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="Re-enter your new password"
              value={confirmPassword}
              onChange={e => actions.setConfirmPassword(e.target.value)}
              className="h-12 rounded-xl"
              disabled={loading}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full rounded-xl"
            size="lg"
            variant="hero"
            disabled={loading}
          >
            {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </Button>
        </form>
      ) : (
        <Link href="/signin">
          <Button variant="hero" className="w-full rounded-xl">
            Proceed to Sign In
          </Button>
        </Link>
      )}

      <div className="text-center">
        <Link href="/signin">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Button>
        </Link>
      </div>
    </Card>
  );
}

export function ResetPasswordView() {
  return (
    <div className="min-h-svh flex items-center justify-center p-4 bg-gradient-to-br from-background via-background-muted to-background">
      <Suspense
        fallback={
          <Card className="w-full max-w-md p-8 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </Card>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
