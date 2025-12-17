import { Router } from 'express';
import {
  getPlanController,
  getPlansController,
  getUserPlanController,
} from '../controllers/plan.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router: Router = Router();

// Public routes - anyone can view available plans
router.get('/plans', getPlansController);
router.get('/plans/:name', getPlanController);

// Protected route - get user's current plan
router.get('/user/plan', authMiddleware, getUserPlanController);

export default router;
