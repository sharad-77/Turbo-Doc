import { z } from 'zod';

export const signUpSchema = z.object({
  body: z
    .object({
      email: z.string().email('Invalid email address'),
      password: z.string().min(8, 'Password must be at least 8 characters long'),
      name: z.string().min(2, 'Name must be at least 2 characters long'),
      phoneNumber: z.string().optional(),
    })
    .passthrough(),
});

export const signInEmailSchema = z.object({
  body: z
    .object({
      email: z.string().email('Invalid email address'),
      password: z.string().min(1, 'Password is required'),
    })
    .passthrough(),
});

export const forgetPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    redirectTo: z.string().url('Invalid redirect URL').optional(),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
    token: z.string().min(1, 'Reset token is required'),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
    revokeOtherSessions: z.boolean().optional(),
  }),
});

export const sendVerificationEmailSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
  }),
});

export const verifyEmailSchema = z.object({
  query: z
    .object({
      token: z.string().min(1, 'Verification token is required').optional(),
    })
    .optional(),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInEmailInput = z.infer<typeof signInEmailSchema>;
export type ForgetPasswordInput = z.infer<typeof forgetPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type SendVerificationEmailInput = z.infer<typeof sendVerificationEmailSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
