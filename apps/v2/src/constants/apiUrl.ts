export const API_URLS = {
  SIGNUP_EMAIL: '/sign-up/email',
  SIGNIN_EMAIL: '/sign-in/email',
  SIGNOUT: '/sign-out',
  SESSION: '/get-session',
  VERIFY_EMAIL: '/verify-email',
  SEND_VERIFICATION_EMAIL: '/send-verification-email',
  FORGET_PASSWORD: '/forget-password',
  RESET_PASSWORD: '/reset-password',
  CHANGE_PASSWORD: '/change-password',
  CHANGE_EMAIL: '/change-email',
  TWO_FACTOR_SEND_OTP: '/two-factor/send-otp',
  TWO_FACTOR_VERIFY_OTP: '/two-factor/verify-otp',
  ME: '/me',
} as const;

export type ApiUrls = typeof API_URLS;
