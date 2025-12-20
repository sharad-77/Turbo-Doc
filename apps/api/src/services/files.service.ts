import { prisma } from '@repo/database';

interface File {
  id: string;
  name: string;
  size: number;
  type: 'document' | 'image';
  format: string;
  status: string;
  createdAt: Date;
  downloadUrl?: string;
  processedS3Key?: string;
}

/**
 * Get all files (documents + images) for a user
 */
export const getFilesService = async (userId: string): Promise<File[]> => {
  const documents = await prisma.document.findMany({
    where: {
      userId,
      status: 'COMPLETED',
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      originalFileName: true,
      targetFormat: true,
      processedFileSize: true,
      processedS3Key: true,
      status: true,
      createdAt: true,
    },
  });

  const images = await prisma.image.findMany({
    where: {
      userId,
      status: 'COMPLETED',
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      originalFileName: true,
      targetFormat: true,
      processedFileSize: true,
      processedS3Key: true,
      status: true,
      createdAt: true,
    },
  });

  const files: File[] = [
    ...documents.map(doc => ({
      id: doc.id,
      name: doc.originalFileName,
      size: doc.processedFileSize || 0,
      type: 'document' as const,
      format: doc.targetFormat || 'pdf',
      status: doc.status,
      createdAt: doc.createdAt,
      processedS3Key: doc.processedS3Key || undefined,
    })),
    ...images.map(img => ({
      id: img.id,
      name: img.originalFileName,
      size: img.processedFileSize || 0,
      type: 'image' as const,
      format: img.targetFormat || 'png',
      status: img.status,
      createdAt: img.createdAt,
      processedS3Key: img.processedS3Key || undefined,
    })),
  ];

  files.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return files;
};

/**
 * Get user profile with account information
 */
export const getProfileService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      accounts: {
        select: {
          providerId: true,
          accountId: true,
        },
      },
      userUsage: true,
      subscription: {
        include: {
          plan: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    emailVerified: user.emailVerified,
    plan: user.plan,
    createdAt: user.createdAt,
    accounts: user.accounts.map(acc => ({
      providerId: acc.providerId,
      accountId: acc.accountId,
    })),
    usage: user.userUsage,
    subscription: user.subscription,
  };
};

/**
 * Update user profile (name, email)
 */
export const updateProfileService = async (
  userId: string,
  data: { name?: string; email?: string }
) => {
  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.email && { email: data.email, emailVerified: false }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });

  return updated;
};

/**
 * Delete a file (document or image)
 */
export const deleteFileService = async (
  fileId: string,
  fileType: 'document' | 'image',
  userId: string
) => {
  if (fileType === 'document') {
    const doc = await prisma.document.findFirst({
      where: { id: fileId, userId },
    });

    if (!doc) {
      throw new Error('Document not found');
    }

    await prisma.document.delete({
      where: { id: fileId },
    });
  } else {
    const img = await prisma.image.findFirst({
      where: { id: fileId, userId },
    });

    if (!img) {
      throw new Error('Image not found');
    }

    await prisma.image.delete({
      where: { id: fileId },
    });
  }

  return { success: true };
};
