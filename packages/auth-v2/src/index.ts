import { betterAuth } from 'better-auth';
import { pool } from '@repo/database-v2';
import { client } from '@repo/redis';
import { redisStorage } from '@better-auth/redis-storage';
import { sendVerificationEmail, sendPasswordResetEmail } from '@repo/email';

const isProduction = process.env.NODE_ENV === 'production';
const cookieDomain = process.env.COOKIE_DOMAIN || (isProduction ? 'sharad.fun' : undefined);

export const auth = betterAuth({
  appName: 'Turbo-Doc',
  baseURL: process.env.API_URL,
  basePath: '/api/v2/auth',
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.API_URL,
    ...(cookieDomain
      ? [
          `https://${cookieDomain.replace(/^\./, '')}`,
          `https://*.${cookieDomain.replace(/^\./, '')}`,
        ]
      : []),
  ].filter(Boolean) as string[],
  database: pool,
  secondaryStorage: redisStorage({
    client,
    keyPrefix: 'auth:',
  }),
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    storeSessionInDatabase: true,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
      strategy: 'jwe',
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      void sendPasswordResetEmail({
        to: user.email,
        name: user.name,
        url,
      }).catch(err => {
        console.error('[Auth:sendResetPasswordError]', err);
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      void sendVerificationEmail({
        to: user.email,
        name: user.name,
        url,
      }).catch(err => {
        console.error('[Auth:sendVerificationEmailError]', err);
      });
    },
  },
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? {
          github: {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          },
        }
      : {}),
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['google', 'github'],
    },
  },
  user: {
    additionalFields: {
      phoneNumber: {
        type: 'string',
        required: false,
        input: true,
      },
      phoneNumberVerified: {
        type: 'boolean',
        required: false,
        defaultValue: false,
        input: false,
      },
    },
  },
  advanced: {
    useSecureCookies: isProduction,
    crossSubDomainCookies: {
      enabled: Boolean(cookieDomain),
      domain: cookieDomain ? cookieDomain.replace(/^\./, '') : undefined,
    },
    cookieOptions: {
      sameSite: 'lax',
      secure: isProduction,
      httpOnly: true,
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
export { toNodeHandler, fromNodeHeaders } from 'better-auth/node';
