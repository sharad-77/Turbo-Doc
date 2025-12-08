import { Router } from 'express';
import { getPresignedUrl } from '../controllers/upload.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { planMiddleware } from '../middleware/plan.middleware.js';
import { storageMiddleware } from '../middleware/storage.middleware.js';

const router: Router = Router();

router.post(
  '/get-presigned-url',
  authMiddleware,
  planMiddleware,
  storageMiddleware,
  getPresignedUrl
);

export default router;
