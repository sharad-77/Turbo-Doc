import { Request } from 'express';

export interface AuthRequest extends Request {
  userId?: string;
  user?: any;
  session?: any;
  guestId?: string;
  plan?: 'GUEST' | 'FREE' | 'PRO';
}
