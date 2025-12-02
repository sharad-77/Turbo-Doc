import { Router } from 'express';
import {
  convertController,
  mergePdfController,
  splitPdfController,
} from '../controllers/document.controller.js';

const router: Router = Router();

// PDF Conversion Operations
router.post('/merge-pdf', mergePdfController);
router.post('/split-pdf', splitPdfController);

// All Docuement Conversion
router.post('/convert', convertController);

export default router;
