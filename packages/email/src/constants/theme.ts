export const EMAIL_THEME = {
  colors: {
    primary: '#2563eb',
    primaryDark: '#1d4ed8',
    background: '#f8fafc',
    cardBackground: '#ffffff',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#94a3b8',
    borderColor: '#e2e8f0',
    buttonText: '#ffffff',
    warningBackground: '#fef3c7',
    warningText: '#92400e',
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    titleSize: '24px',
    subtitleSize: '16px',
    bodySize: '15px',
    smallSize: '13px',
    lineHeight: '1.6',
  },
  layout: {
    maxWidth: '580px',
    cardBorderRadius: '8px',
    buttonBorderRadius: '6px',
  },
  branding: {
    appName: 'Turbo-Doc',
    companyName: 'Turbo-Doc',
    supportEmail: 'support@turbodoc.io',
    copyrightYear: new Date().getFullYear(),
  },
} as const;

export type EmailTheme = typeof EMAIL_THEME;
