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
    // check if user is logged in
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (session?.user?.id) {
      req.userId = session.user.id;
      req.user = session.user;
      req.session = session.session;

      // Ensure UserUsage exists
      await prisma.userUsage.upsert({
        where: { userId: session.user.id },
        update: {},
        create: { userId: session.user.id },
      });

      return next();
    }

    // handle guest user
    const ip = req.ip || '127.0.0.1';
    const fingerprint = req.headers['x-fingerprint'];
    const userAgent = req.headers['user-agent'] || 'unknown';

    // make sure fingerprint exists
    if (!fingerprint || typeof fingerprint !== 'string') {
      return res.status(400).json({
        error: 'Missing Fingerprint',
        message: 'x-fingerprint header is required',
      });
    }

    // find or create the guest
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
