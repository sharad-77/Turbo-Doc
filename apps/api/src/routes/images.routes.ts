import { Router } from 'express';
import {
  compressImageController,
  convertImageController,
  resizeImageController,
} from '../controllers/images.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { limitMiddleware } from '../middleware/limit.middleware.js';
import { planMiddleware } from '../middleware/plan.middleware.js';
import { storageMiddleware } from '../middleware/storage.middleware.js';

const router: Router = Router();

router.post(
  '/convert',
  authMiddleware,
  planMiddleware,
  limitMiddleware('IMAGE'),
  storageMiddleware,
  convertImageController
);
router.post(
  '/compress',
  authMiddleware,
  planMiddleware,
  limitMiddleware('IMAGE'),
  storageMiddleware,
  compressImageController
);
router.post(
  '/resize',
  authMiddleware,
  planMiddleware,
  limitMiddleware('IMAGE'),
  storageMiddleware,
  resizeImageController
);

export default router;
