import { NextFunction, Response } from 'express';
import { AuthRequest } from '../types/express.types.js';

export const planMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user) {
      const planName = (req.user.plan || 'FREE').toUpperCase();

      if (planName === 'PRO') {
        req.plan = 'PRO';
      } else {
        req.plan = 'FREE';
      }
      return next();
    }

    if (req.guestId) {
      req.plan = 'GUEST';
      return next();
    }

    req.plan = 'GUEST';
    next();
  } catch (error) {
    console.error('Plan Middleware Error:', error);
    res.status(500).json({ error: 'Internal Server Error during Plan Resolution' });
  }
};
