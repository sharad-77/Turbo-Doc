import { env } from '@/config/env';

export const API_BASE_URL = env.apiUrl;

export const API_ENDPOINTS = {
  AUTH: {
    SESSION: '/api/v2/auth/get-session',
    SIGN_IN: '/api/v2/auth/sign-in',
    SIGN_UP: '/api/v2/auth/sign-up',
    SIGN_OUT: '/api/v2/auth/sign-out',
    VERIFY_EMAIL: '/api/v2/auth/verify-email',
    FORGET_PASSWORD: '/api/v2/auth/forget-password',
    RESET_PASSWORD: '/api/v2/auth/reset-password',
  },
  DASHBOARD: {
    STATS: '/api/dashboard/stats',
  },
  FILES: {
    LIST: '/api/v1/files',
    BY_TYPE: (type: 'document' | 'image' | string, id: string) => `/api/v1/files/${type}/${id}`,
  },
  DOCUMENTS: {
    CONVERT: '/api/v1/documents/convert',
    MERGE_PDF: '/api/v1/documents/merge-pdf',
    SPLIT_PDF: '/api/v1/documents/split-pdf',
  },
  IMAGES: {
    CONVERT: '/api/v1/images/convert',
    COMPRESS: '/api/v1/images/compress',
    RESIZE: '/api/v1/images/resize',
  },
  JOBS: {
    STATUS: (jobId: string) => `/api/jobs/${jobId}`,
  },
  PLANS: {
    LIST: '/api/v1/plans',
    BY_NAME: (name: string) => `/api/v1/plans/${name}`,
    USER_PLAN: '/api/v1/user/plan',
  },
  PAYMENTS: {
    CREATE_ORDER: '/api/v1/payments/create-order',
    VERIFY: '/api/v1/payments/verify',
  },
  PROFILE: {
    ME: '/api/v1/profile',
  },
  SETTINGS: {
    PASSWORD: '/api/v1/settings/password',
    EMAIL: '/api/v1/settings/email',
  },
  STORAGE: {
    PRESIGNED_UPLOAD: '/api/v1/get-presigned-url',
    PRESIGNED_DOWNLOAD: '/api/v1/get-download-url',
    DOWNLOAD: (objectKey: string) => `/api/v1/download?objectKey=${encodeURIComponent(objectKey)}`,
  },
} as const;
