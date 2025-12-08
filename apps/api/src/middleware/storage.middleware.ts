import { prisma } from '@repo/database';
import { NextFunction, Response } from 'express';
import { AuthRequest } from '../types/express.types.js';

export const storageMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const plan = req.plan || 'GUEST';

    if (plan === 'GUEST' || !req.userId) {
      return next();
    }

    const limits = {
      FREE: 200, // MB
      PRO: 500, // MB
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const limitMB = (limits as any)[plan];
    if (!limitMB) {
      return next();
    }

    const limitBytes = limitMB * 1024 * 1024;

    const [docUsage, imgUsage] = await Promise.all([
      prisma.document.aggregate({
        where: { userId: req.userId },
        _sum: { fileSize: true, processedFileSize: true },
      }),
      prisma.image.aggregate({
        where: { userId: req.userId },
        _sum: { fileSize: true, processedFileSize: true },
      }),
    ]);

    const currentUsageBytes =
      (docUsage._sum.fileSize || 0) +
      (docUsage._sum.processedFileSize || 0) +
      (imgUsage._sum.fileSize || 0) +
      (imgUsage._sum.processedFileSize || 0);

    const contentLength = req.headers['content-length'];
    const newFileSize = contentLength ? parseInt(contentLength, 10) : 0;

    if (currentUsageBytes + newFileSize > limitBytes) {
      res.status(507).json({
        error: `Storage limit exceeded for ${plan} plan.`,
        limitMB: limitMB,
        currentUsageMB: (currentUsageBytes / (1024 * 1024)).toFixed(2),
        uploadSizeMB: (newFileSize / (1024 * 1024)).toFixed(2),
      });
      return;
    }

    next();
  } catch (error) {
    console.error('Storage Middleware Error:', error);
    res.status(500).json({ error: 'Internal Server Error during Storage Check' });
  }
};
