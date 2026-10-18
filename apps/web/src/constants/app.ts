export const APP_CONFIG = {
  NAME: 'Turbo-Doc',
  TAGLINE: 'Professional File Conversion & Management',
  SUPPORT_EMAIL: 'support@turbodoc.io',
  SUPPORT_HOURS: {
    WEEKDAYS: 'Monday - Friday: 9:00 AM - 6:00 PM IST',
    WEEKENDS: 'Saturday - Sunday: 10:00 AM - 4:00 PM IST',
  },
} as const;

export const SUPPORTED_FILE_FORMATS = {
  DOCUMENTS: ['pdf', 'docx', 'doc', 'txt'] as const,
  IMAGES: ['jpeg', 'jpg', 'webp', 'avif', 'png', 'gif'] as const,
} as const;
