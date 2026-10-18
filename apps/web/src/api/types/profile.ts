export interface UserAccount {
  providerId: string;
  accountId: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string | null;
  phoneNumberVerified?: boolean;
  image?: string | null;
  emailVerified: boolean;
  plan: string;
  createdAt: Date;
  accounts: UserAccount[];
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phoneNumber?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateEmailRequest {
  email: string;
}
