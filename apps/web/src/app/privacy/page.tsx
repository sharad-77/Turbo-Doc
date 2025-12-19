'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PrivacyPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the full privacy policy page
    router.replace('/privacy-policy');
  }, [router]);

  return (
    <div className="min-h-svh flex items-center justify-center">
      <p className="text-muted-foreground">Redirecting to Privacy Policy...</p>
    </div>
  );
}
