import { ServerResponse } from 'http';
import { auth, fromNodeHeaders, Session } from '@repo/auth-v2';
import { ExtendedRequest, NextFunctionInterface } from '../interfaces/index.js';
import { UnauthorizedException } from '../exceptions/index.js';

export async function requireAuth(
  req: ExtendedRequest,
  _res: ServerResponse,
  next: NextFunctionInterface
) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return next(new UnauthorizedException('Authentication required'));
    }

    const maxAgeMs = 30 * 24 * 60 * 60 * 1000;
    if (Date.now() - new Date(session.session.createdAt).getTime() > maxAgeMs) {
      return next(new UnauthorizedException('Session expired. Please log in again.'));
    }

    (req as ExtendedRequest & { auth?: Session }).auth = session;
    next();
  } catch (err) {
    next(err);
  }
}
