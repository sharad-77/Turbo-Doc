import { Request } from 'express';

export interface AuthRequest extends Request {
  userId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  session?: any;
  guestId?: string;
  plan?: 'GUEST' | 'FREE' | 'PRO';
}
