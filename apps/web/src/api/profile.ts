import apiClient from '@/lib/api-client';

// Types
export interface UserFile {
  id: string;
  name: string;
  size: number;
  type: 'document' | 'image';
  format: string;
  status: string;
  createdAt: Date;
  processedS3Key?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  emailVerified: boolean;
  plan: string;
  createdAt: Date;
  accounts: Array<{
    providerId: string;
    accountId: string;
  }>;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateEmailRequest {
  email: string;
}

// API Functions

/**
 * Get all user files (documents + images)
 */
export const getFiles = async (): Promise<UserFile[]> => {
  const response = await apiClient.get('/api/v1/files');
  return response.data;
};

/**
 * Delete a file
 */
export const deleteFile = async (fileId: string, fileType: 'document' | 'image'): Promise<void> => {
  await apiClient.delete(`/api/v1/files/${fileType}/${fileId}`);
};

/**
 * Get user profile
 */
export const getProfile = async (): Promise<UserProfile> => {
  const response = await apiClient.get('/api/v1/profile');
  return response.data;
};

/**
 * Update user profile (name/email)
 */
export const updateProfile = async (data: UpdateProfileRequest): Promise<UserProfile> => {
  const response = await apiClient.put('/api/v1/profile', data);
  return response.data;
};

/**
 * Change password
 */
export const changePassword = async (
  data: ChangePasswordRequest
): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.post('/api/v1/settings/password', data);
  return response.data;
};

/**
 * Update email
 */
export const updateEmail = async (
  data: UpdateEmailRequest
): Promise<{ id: string; email: string; emailVerified: boolean }> => {
  const response = await apiClient.put('/api/v1/settings/email', data);
  return response.data;
};
