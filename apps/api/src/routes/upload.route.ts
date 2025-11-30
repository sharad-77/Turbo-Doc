import { Router } from 'express';
import { getPresignedUrl } from '../controllers/upload.controller.js';

const router: Router = Router();

router.post('/get-presigned-url', getPresignedUrl);

export default router;
