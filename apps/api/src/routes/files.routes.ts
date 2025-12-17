import { Router } from 'express';
import {
  deleteFileController,
  getFilesController,
  getProfileController,
  updateProfileController,
} from '../controllers/files.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router: Router = Router();

// Files routes
router.get('/files', authMiddleware, getFilesController);
router.delete('/files/:type/:id', authMiddleware, deleteFileController);

// Profile routes
router.get('/profile', authMiddleware, getProfileController);
router.put('/profile', authMiddleware, updateProfileController);

export default router;
