'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function TermsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to cancellation policy which includes terms
    router.replace('/cancellation-policy');
  }, [router]);

  return (
    <div className="min-h-svh flex items-center justify-center">
      <p className="text-muted-foreground">Redirecting to Terms of Service...</p>
    </div>
  );
}
