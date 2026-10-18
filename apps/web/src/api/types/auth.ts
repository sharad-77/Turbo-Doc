export interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  agreeToTerms: boolean;
}

export interface SignInFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export type EmailVerificationStatus = 'verifying' | 'success' | 'error';
