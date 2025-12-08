import { Router } from 'express';
import { createOrder, handleWebhook, verifyPayment } from '../controllers/payment.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router: Router = Router();

router.post('/create-order', authMiddleware, createOrder);
router.post('/verify', authMiddleware, verifyPayment);
router.post('/webhook', handleWebhook);

export default router;
