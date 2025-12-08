import { Router } from 'express';
import { getJobStatusController } from '../controllers/jobs.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router: Router = Router();

router.get('/:jobId', authMiddleware, getJobStatusController);

export default router;
