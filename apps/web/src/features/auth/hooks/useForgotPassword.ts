'use client';

import { useState } from 'react';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/constants';
import { toast } from 'sonner';
import { forgetPassword } from '@/lib/auth-client';

export function useForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const res = await forgetPassword({
        email: email.trim(),
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (res.error) {
        toast.error(res.error.message || 'Failed to send reset link');
      } else {
        setSent(true);
        toast.success(SUCCESS_MESSAGES.RESET_LINK_SENT);
      }
    } catch {
      toast.error(ERROR_MESSAGES.DEFAULT);
    } finally {
      setLoading(false);
    }
  };

  return {
    state: {
      email,
      loading,
      sent,
    },
    actions: {
      setEmail,
      handleSubmit,
    },
  };
}
