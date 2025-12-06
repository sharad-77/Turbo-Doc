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

type IpAddress = string;
type Fingerprint = string;

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (session?.user?.id) {
      req.userId = session.user.id;
      req.user = session.user;
      req.session = session.session;
      return next();
    }

    const ip: IpAddress = req.ip as IpAddress;
    const fingerprintHeader = req.headers['x-fingerprint'];
    const fingerprint: Fingerprint | null =
      typeof fingerprintHeader === 'string' ? fingerprintHeader : null;

    let guest = await prisma.guestUsage.findFirst({
      where: {
        ipAddress: ip,
        fingerprint: fingerprint,
      },
    });

    if (!guest) {
      guest = await prisma.guestUsage.create({
        data: {
          ipAddress: ip,
          fingerprint,
        },
      });
    }

    req.guestId = guest.id;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(500).json({ error: 'Authentication Error', details: (error as Error).message });
    // next(error); // Optionally pass to global handler, but responding here is safer for now to ensure visibility
  }
};
