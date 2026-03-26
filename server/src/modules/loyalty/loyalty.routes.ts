/**
 * Loyalty Routes
 *
 * Dùng: express.Router()
 * Middleware: authMiddleware, validate(schema), roleGuard(['ADMIN'])
 * Mount: app.use('/api/loyalty', loyaltyRoutes) trong app.ts
 */

import { Router } from 'express';
import * as loyaltyController from './loyalty.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = Router();

// PUBLIC - Member ranking endpoints (anyone can view)
/**
 * GET /api/loyalty/ranking/points - Top members by loyalty points
 * Xem bảng xếp hạng thành viên - Top khách hàng theo điểm
 */
router.get('/ranking/points', loyaltyController.getMemberRankingByPoints);

/**
 * GET /api/loyalty/ranking/tier - Top members by membership tier
 * Xem bảng xếp hạng thành viên - Top khách hàng theo hạng
 */
router.get('/ranking/tier', loyaltyController.getMemberRankingByTier);

/**
 * GET /api/loyalty/ranking - Detailed member ranking
 * Xem bảng xếp hạng thành viên chi tiết
 */
router.get('/ranking', loyaltyController.getMemberRankingDetailed);

router.use(protect);

export default router;
