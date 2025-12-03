import { Router } from 'express';
import {
  compressImageController,
  convertImageController,
  resizeImageController,
} from '../controllers/images.controller.js';

const router: Router = Router();

router.post('/Image-convert', convertImageController);
router.post('/compress', compressImageController);
router.post('/resize', resizeImageController);

export default router;
