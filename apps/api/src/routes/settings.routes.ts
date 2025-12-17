import { Router } from 'express';
import {
  changePasswordController,
  updateEmailController,
} from '../controllers/settings.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router: Router = Router();

// Settings routes
router.post('/password', authMiddleware, changePasswordController);
router.put('/email', authMiddleware, updateEmailController);

export default router;
