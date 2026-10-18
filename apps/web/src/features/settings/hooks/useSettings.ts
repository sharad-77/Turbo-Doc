'use client';

import { useState } from 'react';
import {
  useChangePasswordMutation,
  useProfileQuery,
  useUpdateEmailMutation,
} from '@/api';

export function useSettings() {
  const { data: profile, isLoading } = useProfileQuery();
  const updateEmailMutation = useUpdateEmailMutation();
  const changePasswordMutation = useChangePasswordMutation();

  const [emailData, setEmailData] = useState({ newEmail: '' });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const hasCredentialAccount = profile?.accounts?.some(acc => acc.providerId === 'credential');
  const isOAuthOnly = !hasCredentialAccount && (profile?.accounts?.length || 0) > 0;
  const oauthProvider = profile?.accounts?.find(acc => acc.providerId !== 'credential')?.providerId;

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailData.newEmail.trim()) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailData.newEmail.trim())) return;

    updateEmailMutation.mutate(
      { email: emailData.newEmail.trim() },
      {
        onSuccess: () => {
          setEmailData({ newEmail: '' });
        },
      }
    );
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      return;
    }

    if (passwordData.newPassword.length < 8) return;
    if (passwordData.newPassword !== passwordData.confirmPassword) return;

    changePasswordMutation.mutate(
      {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      },
      {
        onSuccess: () => {
          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        },
      }
    );
  };

  return {
    state: {
      profile,
      emailData,
      passwordData,
      isOAuthOnly,
      oauthProvider,
      isLoading,
      isUpdatingEmail: updateEmailMutation.isPending,
      isChangingPassword: changePasswordMutation.isPending,
    },
    actions: {
      setEmailData,
      setPasswordData,
      handleEmailSubmit,
      handlePasswordSubmit,
    },
  };
}
