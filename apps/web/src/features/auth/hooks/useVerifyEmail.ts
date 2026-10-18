'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ERROR_MESSAGES } from '@/constants';
import { authClient } from '@/lib/auth-client';

export function useVerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>(() =>
    token ? 'verifying' : 'error'
  );
  const [errorMessage, setErrorMessage] = useState(() =>
    !token ? 'Verification token is missing.' : ''
  );

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        const res = await authClient.verifyEmail({
          query: { token },
        });

        if (res.error) {
          setStatus('error');
          setErrorMessage(res.error.message || 'Verification token is invalid or expired.');
        } else {
          setStatus('success');
          setTimeout(() => {
            router.push('/signin');
          }, 3000);
        }
      } catch {
        setStatus('error');
        setErrorMessage(ERROR_MESSAGES.DEFAULT);
      }
    };

    void verify();
  }, [token, router]);

  return {
    state: {
      status,
      errorMessage,
    },
    actions: {},
  };
}
