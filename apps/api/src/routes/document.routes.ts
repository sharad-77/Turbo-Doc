import { Router } from 'express';
import {
  convertController,
  mergePdfController,
  splitPdfController,
} from '../controllers/document.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { limitMiddleware } from '../middleware/limit.middleware.js';
import { planMiddleware } from '../middleware/plan.middleware.js';
import { storageMiddleware } from '../middleware/storage.middleware.js';

const router: Router = Router();

// PDF Conversion Operations
router.post(
  '/merge-pdf',
  authMiddleware,
  planMiddleware,
  limitMiddleware('MERGE'),
  storageMiddleware,
  mergePdfController
);

router.post(
  '/split-pdf',
  authMiddleware,
  planMiddleware,
  limitMiddleware('DOCUMENT'),
  storageMiddleware,
  splitPdfController
);

// All Document Conversion
router.post(
  '/convert',
  authMiddleware,
  planMiddleware,
  limitMiddleware('DOCUMENT'),
  storageMiddleware,
  convertController
);

export default router;
