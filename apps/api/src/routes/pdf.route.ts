import { Router } from 'express';
import { mergePdfController } from '../controllers/pdf.controller.js';

const router: Router = Router();

router.post('/merge-pdf', mergePdfController);

export default router;
