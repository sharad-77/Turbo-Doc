import { queryKeys } from '@/api/query-keys';
import type {
  ChangePasswordRequest,
  UpdateEmailRequest,
  UpdateProfileRequest,
  UserProfile,
} from '@/api/types';
import { API_ENDPOINTS, SUCCESS_MESSAGES } from '@/constants';
import apiClient from '@/lib/api-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const updateProfile = async (data: UpdateProfileRequest): Promise<UserProfile> => {
  const response = await apiClient.put<UserProfile>(API_ENDPOINTS.PROFILE.ME, data);
  return response.data;
};

export const changePassword = async (
  data: ChangePasswordRequest
): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.post(API_ENDPOINTS.SETTINGS.PASSWORD, data);
  return response.data;
};

export const updateEmail = async (
  data: UpdateEmailRequest
): Promise<{ id: string; email: string; emailVerified: boolean }> => {
  const response = await apiClient.put(API_ENDPOINTS.SETTINGS.EMAIL, data);
  return response.data;
};

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => updateProfile(data),
    meta: {
      successMessage: SUCCESS_MESSAGES.PROFILE_UPDATED,
      invalidates: [queryKeys.profile.me()],
    },
    onSuccess: (updatedProfile: UserProfile) => {
      queryClient.setQueryData(queryKeys.profile.me(), updatedProfile);
    },
  });
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => changePassword(data),
    meta: {
      successMessage: SUCCESS_MESSAGES.PASSWORD_CHANGED,
    },
  });
}

export function useUpdateEmailMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateEmailRequest) => updateEmail(data),
    meta: {
      successMessage: SUCCESS_MESSAGES.EMAIL_UPDATED,
      invalidates: [queryKeys.profile.me()],
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.me() });
    },
  });
}
