export const ERROR_MESSAGES = {
  DEFAULT: 'An unexpected error occurred. Please try again.',
  DAILY_LIMIT: 'Daily conversion limit reached. Please upgrade your plan.',
  RATE_LIMIT: 'Too many requests. Please slow down and try again shortly.',
  SERVER_ERROR: 'Server error encountered. Please try again later.',
  TIMEOUT: 'Request timed out. Please check your network connection.',
  UNAUTHORIZED: 'Your session has expired. Please sign in again.',
  FORBIDDEN: 'Access denied. You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
} as const;

export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  EMAIL_UPDATED: 'Verification email sent. Please check your inbox.',
  FILE_DELETED: 'File deleted successfully',
  FILE_CONVERTED: 'File converted successfully',
  PAYMENT_VERIFIED: 'Payment verified successfully! Welcome to Pro.',
  CONTACT_SENT: "Message sent successfully! We'll get back to you within 24 hours.",
  RESET_LINK_SENT: 'Password reset link sent to your email',
  PASSWORD_RESET_SUCCESS: 'Password reset successfully! You can now sign in.',
} as const;
