'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { APP_CONFIG } from '@/lib/constants';
import { signInSchema, type SignInInput } from '@/lib/validations/auth';
import { useAuthStore } from '@/store/useAuthStore';

export function useSignIn() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'github' | null>(null);

  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInInput) => {
    setLoading(true);
    try {
      await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
          callbackURL: APP_CONFIG.DASHBOARD_URL,
        },
        {
          onRequest: () => {
            setLoading(true);
          },
          onSuccess: async () => {
            await useAuthStore.getState().checkAuth();
            toast.success('Signed in successfully');
            router.push(APP_CONFIG.DASHBOARD_URL);
          },
          onError: ctx => {
            toast.error(ctx.error.message);
            setLoading(false);
          },
        }
      );
    } catch {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: 'github' | 'google') => {
    try {
      setSocialLoading(provider);
      await authClient.signIn.social({
        provider,
        callbackURL: APP_CONFIG.DASHBOARD_URL,
      });
    } catch {
      toast.error(`Failed to sign in with ${provider}. Please try again.`);
      setSocialLoading(null);
    }
  };

  return {
    state: {
      form,
      showPassword,
      loading,
      socialLoading,
    },
    actions: {
      setShowPassword,
      onSubmit,
      handleSocialSignIn,
    },
  };
}
