'use client';

import { Suspense } from 'react';
import { Button } from '@repo/ui/components/ui/button';
import { Card } from '@repo/ui/components/ui/card';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useVerifyEmail } from './hooks/useVerifyEmail';

function VerifyEmailContent() {
  const { state } = useVerifyEmail();
  const { status, errorMessage } = state;

  return (
    <Card className="w-full max-w-md p-8 space-y-6 text-center">
      {status === 'verifying' && (
        <div className="space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
          <h1 className="text-2xl font-space-grotesk font-bold">Verifying Your Email</h1>
          <p className="text-muted-foreground text-sm">
            Please wait while we confirm your email address...
          </p>
        </div>
      )}

      {status === 'success' && (
        <div className="space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-space-grotesk font-bold">Email Verified!</h1>
          <p className="text-muted-foreground text-sm">
            Your email address has been verified successfully. Redirecting you to sign in...
          </p>
          <Link href="/signin">
            <Button variant="hero" className="w-full rounded-xl mt-4">
              Sign In Now
            </Button>
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-4">
          <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-space-grotesk font-bold">Verification Failed</h1>
          <p className="text-muted-foreground text-sm">
            {errorMessage || 'The verification link is invalid or has expired.'}
          </p>
          <Link href="/signin">
            <Button variant="outline" className="w-full rounded-xl mt-4">
              Back to Sign In
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
}

export function VerifyEmailView() {
  return (
    <div className="min-h-svh flex items-center justify-center p-4 bg-gradient-to-br from-background via-background-muted to-background">
      <Suspense
        fallback={
          <Card className="w-full max-w-md p-8 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </Card>
        }
      >
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
