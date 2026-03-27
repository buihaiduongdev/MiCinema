import { Router } from 'express';
import { handlePayment } from './payment.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();

// Route: POST /api/payments/pay
router.post('/pay', protect, handlePayment);

export default router;
