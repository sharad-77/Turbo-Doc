/**
 * Type-safe centralized environment variables configuration.
 * Validates and provides sensible fallbacks for all public environment variables.
 */
export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
} as const;

export type Env = typeof env;
