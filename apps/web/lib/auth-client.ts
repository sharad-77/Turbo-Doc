import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // baseURL: process.env.NEXT_PUBLIC_API_URL, // Removed to use default origin
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  resetPassword,
  // forgetPassword
} = authClient;
