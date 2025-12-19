
export const APP_CONFIG = {
  FRONTEND_URL: process.env.NEXT_PUBLIC_APP_URL!,
  BACKEND_URL: process.env.NEXT_PUBLIC_API_URL!,
  DASHBOARD_URL: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
} as const;
