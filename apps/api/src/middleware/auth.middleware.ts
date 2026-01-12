import { auth } from '@repo/auth';
import { prisma } from '@repo/database';
import { fromNodeHeaders } from 'better-auth/node';
import { NextFunction, Request, Response } from 'express';

interface AuthRequest extends Request {
  userId?: string;
  user?: object;
  session?: object;
  guestId?: string;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (session?.user?.id) {
      req.userId = session.user.id;
      req.user = session.user;
      req.session = session.session;

      try {
        await prisma.userUsage.upsert({
          where: { userId: session.user.id },
          update: {},
          create: { userId: session.user.id },
        });

        // eslint-disable-next-line
      } catch (error: any) {
        if (error.code !== 'P2002') {
          throw error;
        }
      }

      return next();
    }

    const ip = req.ip || '127.0.0.1';
    const fingerprint = req.headers['x-fingerprint'];
    const userAgent = req.headers['user-agent'] || 'unknown';

    if (!fingerprint || typeof fingerprint !== 'string') {
      return res.status(400).json({
        error: 'Missing Fingerprint',
        message: 'x-fingerprint header is required',
      });
    }

    const guestUser = await prisma.guestUsage.upsert({
      where: {
        ipAddress_fingerprint: {
          ipAddress: ip,
          fingerprint: fingerprint,
        },
      },
      update: {
        userAgent: userAgent,
        updatedAt: new Date(),
      },
      create: {
        ipAddress: ip,
        fingerprint: fingerprint,
        userAgent: userAgent,
      },
    });

    req.guestId = guestUser.id;
    next();
  } catch (error) {
    console.log('Middleware error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
