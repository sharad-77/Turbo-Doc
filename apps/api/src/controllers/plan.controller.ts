import { prisma } from '@repo/database';
import { Response } from 'express';
import {
  getPlanByNameService,
  getPlansService,
  getUserPlanService,
} from '../services/plan.service.js';
import { AuthRequest } from '../types/express.types.js';

/**
 * GET /api/v1/plans
 * Get all active subscription plans
 */
export const getPlansController = async (req: AuthRequest, res: Response) => {
  try {
    const plans = await getPlansService();
    res.json(plans);
  } catch (error) {
    console.error('Error fetching plans:', error);
    const err = error as Error;
    res.status(500).json({ error: err.message || 'Failed to fetch plans' });
  }
};

/**
 * GET /api/v1/plans/:name
 * Get a specific plan by name (FREE or PRO)
 */
export const getPlanController = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.params;

    if (!name) {
      res.status(400).json({ error: 'Plan name is required' });
      return;
    }

    const plan = await getPlanByNameService(name);
    res.json(plan);
  } catch (error) {
    console.error('Error fetching plan:', error);
    const err = error as Error;

    if (err.message.includes('not found')) {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Failed to fetch plan' });
    }
  }
};

/**
 * GET /api/v1/user/plan
 * Get current user's plan with full details
 */
export const getUserPlanController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId || null;

    // If not logged in, return guest plan
    if (!userId) {
      const guestPlan = await getUserPlanService(null, 'GUEST');
      res.json(guestPlan);
      return;
    }

    // Fetch user from database to get their actual plan
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true },
    });

    const userPlan = user?.plan || 'FREE';
    const plan = await getUserPlanService(userId, userPlan);
    res.json(plan);
  } catch (error) {
    console.error('Error fetching user plan:', error);
    const err = error as Error;
    res.status(500).json({ error: err.message || 'Failed to fetch user plan' });
  }
};
