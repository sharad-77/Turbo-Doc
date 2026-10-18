'use client';

import { useState } from 'react';
import {
  useDashboardStatsQuery,
  useProfileQuery,
  useUpdateProfileMutation,
  useUserPlanQuery,
} from '@/api';

export function useProfile() {
  const { data: profile, isLoading: profileLoading } = useProfileQuery();
  const { data: stats, isLoading: statsLoading } = useDashboardStatsQuery();
  const { data: userPlan, isLoading: planLoading } = useUserPlanQuery();
  const updateMutation = useUpdateProfileMutation();

  const [prevProfile, setPrevProfile] = useState(profile);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    phoneNumber: profile?.phoneNumber || '',
  });

  if (profile !== prevProfile) {
    setPrevProfile(profile);
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phoneNumber: profile.phoneNumber || '',
      });
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    updateMutation.mutate({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phoneNumber: formData.phoneNumber.trim() || undefined,
    });
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const formatStorage = (bytes: number) => {
    return (bytes / 1024 ** 3).toFixed(2);
  };

  return {
    state: {
      profile,
      stats,
      userPlan,
      formData,
      isLoading: profileLoading || statsLoading || planLoading,
      isSaving: updateMutation.isPending,
    },
    actions: {
      setFormData,
      handleSubmit,
      getInitials,
      formatStorage,
    },
  };
}
