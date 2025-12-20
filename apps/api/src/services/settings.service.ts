import { auth } from '@repo/auth';
import { prisma } from '@repo/database';

/**
 * Change user password
 * Only works for users who signed up with email/password (not OAuth)
 */
export const changePasswordService = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      accounts: {
        select: {
          providerId: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const hasCredentialAccount = user.accounts.some(acc => acc.providerId === 'credential');

  if (!hasCredentialAccount) {
    throw new Error(
      'Password change is not available for social media accounts. You signed in with a social provider.'
    );
  }

  if (!user.email) {
    throw new Error('No email found for this account');
  }

  try {
    await auth.api.signInEmail({
      body: {
        email: user.email,
        password: currentPassword,
      },
    });
  } catch {
    throw new Error('Current password is incorrect');
  }

  await auth.api.changePassword({
    body: {
      newPassword,
      currentPassword,
    },
    headers: new Headers({}),
  });

  return { success: true, message: 'Password updated successfully' };
};

/**
 * Update user email
 */
export const updateEmailService = async (userId: string, newEmail: string) => {
  const existing = await prisma.user.findUnique({
    where: { email: newEmail },
  });

  if (existing && existing.id !== userId) {
    throw new Error('Email is already in use by another account');
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      email: newEmail,
      emailVerified: false,
    },
    select: {
      id: true,
      email: true,
      emailVerified: true,
    },
  });

  return updated;
};
