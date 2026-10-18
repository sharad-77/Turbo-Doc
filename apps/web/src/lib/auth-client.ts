import { createAuthClient } from 'better-auth/react';
import { inferAdditionalFields } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  basePath: '/api/v2/auth',
  credentials: 'include',
  plugins: [
    inferAdditionalFields({
      user: {
        phoneNumber: {
          type: 'string',
          required: false,
        },
        phoneNumberVerified: {
          type: 'boolean',
          required: false,
        },
      },
    }),
  ],
});

export const forgetPassword = async ({
  email,
  redirectTo,
}: {
  email: string;
  redirectTo?: string;
}) => {
  return (authClient as unknown as {
    forgetPassword: (opts: {
      email: string;
      redirectTo?: string;
    }) => Promise<{ data?: unknown; error?: { message?: string } }>;
  }).forgetPassword({ email, redirectTo });
};

export const { signIn, signUp, useSession, signOut, getSession } = authClient;

