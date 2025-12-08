import { Response } from 'express';
import { getDashboardStats } from '../services/dashboard.service.js';
import { AuthRequest } from '../types/express.types.js';

export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const stats = await getDashboardStats(userId);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};
