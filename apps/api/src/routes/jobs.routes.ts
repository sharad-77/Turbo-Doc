import { Router } from 'express';
import { getJobStatusController } from '../controllers/jobs.controller.js';

const router: Router = Router();

router.get('/:jobId', getJobStatusController);

export default router;
