'use client';

import { useEffect } from 'react';
import { Button } from '@repo/ui/components/ui/button';
import { Card } from '@repo/ui/components/ui/card';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error for observability
    console.error('Unhandled route error caught by error boundary:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="modern-card max-w-lg w-full p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto text-destructive">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-space-grotesk font-bold">Something went wrong</h1>
          <p className="text-muted-foreground text-sm">
            {error.message || 'An unexpected error occurred while processing your request.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button onClick={() => reset()} variant="hero" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
          <Button variant="outline" asChild className="gap-2">
            <Link href="/">
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </Button>
        </div>

        {error.digest && (
          <p className="text-xs text-muted-foreground pt-4 border-t border-border">
            Error ID: {error.digest}
          </p>
        )}
      </Card>
    </div>
  );
}
