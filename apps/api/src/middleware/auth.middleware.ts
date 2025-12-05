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
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (session?.user?.id) {
    req.userId = session.user.id;
    req.user = session.user;
    req.session = session.session;
    console.log("Account All Ready Created");
    return next();
  }

  const ip: IpAddress = (req.ip as IpAddress);
  const fingerprint:Fingerprint = req.headers['x-fingerprint'] as
  Fingerprint;

  let guest = await prisma.guestUsage.findUnique({
    where: {
      ipAddress_fingerprint: {
        ipAddress : ip,
        fingerprint
      }
    }
  });

  if (!guest) {
    guest = await prisma.guestUsage.create({
      data: {
        ipAddress : ip,
        fingerprint
      }
    });
    console.log("Guest Created");
  }else{
    console.log("Guest All Ready Created");
  }

  req.guestId = guest.id;
  next();
};
