'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { APP_CONFIG } from '@/lib/constants';
import { signUpSchema, type SignUpInput } from '@/lib/validations/auth';

export function useSignUp() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'github' | null>(null);

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      password: '',
      agreeToTerms: false,
    },
  });

  const agreeToTerms = form.watch('agreeToTerms');

  const onSubmit = async (data: SignUpInput) => {
    setLoading(true);
    try {
      await authClient.signUp.email(
        {
          email: data.email,
          password: data.password,
          name: data.name,
          phoneNumber: data.phoneNumber?.trim() ? data.phoneNumber.trim() : undefined,
          callbackURL: APP_CONFIG.DASHBOARD_URL,
        },
        {
          onRequest: () => {
            setLoading(true);
          },
          onSuccess: () => {
            toast.success('Account created! Please check your email to verify your account.');
            router.push('/signin');
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
      agreeToTerms,
    },
    actions: {
      setShowPassword,
      onSubmit,
      handleSocialSignIn,
    },
  };
}
