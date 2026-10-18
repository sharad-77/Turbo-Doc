'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/constants';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';

export function useResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error('Invalid or missing reset token. Please request a new reset link.');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (res.error) {
        toast.error(res.error.message || 'Failed to reset password');
      } else {
        setSuccess(true);
        toast.success(SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS);
        setTimeout(() => {
          router.push('/signin');
        }, 2000);
      }
    } catch {
      toast.error(ERROR_MESSAGES.DEFAULT);
    } finally {
      setLoading(false);
    }
  };

  return {
    state: {
      token,
      password,
      confirmPassword,
      showPassword,
      loading,
      success,
    },
    actions: {
      setPassword,
      setConfirmPassword,
      setShowPassword,
      handleSubmit,
    },
  };
}
