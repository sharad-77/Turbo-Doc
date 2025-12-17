import { prisma } from '@repo/database';
import { NextFunction, Response } from 'express';
import { AuthRequest } from '../types/express.types.js';

type ResourceType = 'DOCUMENT' | 'IMAGE' | 'MERGE';

export const limitMiddleware = (resourceType: ResourceType) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const plan = req.plan || 'GUEST';
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      if (plan === 'GUEST') {
        const guestId = req.guestId;

        if (!guestId) {
          res.status(400).json({ error: 'Guest ID not found' });
          return;
        }

        let guestUsage = await prisma.guestUsage.findUnique({
          where: { id: guestId },
        });

        if (!guestUsage) {
          res.status(404).json({ error: 'Guest Usage not found' });
          return;
        }

        if (guestUsage.lastResetAt < startOfDay) {
          guestUsage = await prisma.guestUsage.update({
            where: { id: guestId },
            data: {
              documentCount: 0,
              imageCount: 0,
              mergeCount: 0,
              lastResetAt: new Date(),
            },
          });
        }

        if (resourceType === 'DOCUMENT' && guestUsage.documentCount >= 1) {
          res.status(403).json({ error: 'Daily document limit reached for Guest (1/day)' });
          return;
        }
        if (resourceType === 'IMAGE' && guestUsage.imageCount >= 1) {
          res.status(403).json({ error: 'Daily image limit reached for Guest (1/day)' });
          return;
        }
        if (resourceType === 'MERGE' && guestUsage.mergeCount >= 1) {
          res.status(403).json({ error: 'Daily merge limit reached for Guest (1/day)' });
          return;
        }

        return next();
      }

      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      let userUsage = await prisma.userUsage.findUnique({
        where: { userId: userId },
      });

      if (!userUsage) {
        userUsage = await prisma.userUsage.create({
          data: { userId },
        });
      }

      if (userUsage.lastResetAt < startOfDay) {
        userUsage = await prisma.userUsage.update({
          where: { userId: userId },
          data: {
            documentCount: 0,
            imageCount: 0,
            mergeCount: 0,
            lastResetAt: new Date(),
          },
        });
      }

      // Fetch plan limits from database
      const planData = await prisma.subscriptionPlan.findUnique({
        where: { name: plan },
        select: {
          dailyDocumentLimit: true,
          dailyImageLimit: true,
          mergeFileLimit: true,
        },
      });

      if (!planData) {
        res.status(500).json({ error: `Plan ${plan} configuration not found` });
        return;
      }

      let currentLimit = 0;
      if (resourceType === 'DOCUMENT') currentLimit = planData.dailyDocumentLimit;
      if (resourceType === 'IMAGE') currentLimit = planData.dailyImageLimit;
      if (resourceType === 'MERGE') currentLimit = planData.mergeFileLimit;

      // -1 means unlimited
      if (currentLimit === -1) {
        return next();
      }

      let currentUsage = 0;
      if (resourceType === 'DOCUMENT') currentUsage = userUsage.documentCount;
      if (resourceType === 'IMAGE') currentUsage = userUsage.imageCount;
      if (resourceType === 'MERGE') currentUsage = userUsage.mergeCount;

      if (currentUsage >= currentLimit) {
        res.status(403).json({
          error: `Daily ${resourceType.toLowerCase()} limit reached for ${plan} plan (${currentLimit}/day).`,
          current: currentUsage,
          limit: currentLimit,
        });
        return;
      }

      next();
    } catch (error) {
      console.error('Limit Middleware Error:', error);
      res.status(500).json({ error: 'Internal Server Error during Limit Check' });
    }
  };
};
