/**
 * Statistics Routes
 *
 * Dùng: express.Router()
 * Middleware: authMiddleware, validate(schema), roleGuard(['ADMIN'])
 * Mount: app.use('/api/statistics', statisticsRoutes) trong app.ts
 */

import { Router } from 'express';
import * as statisticsController from './statistics.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = Router();

// All routes require authentication
router.use(protect);

// GET /api/statistics/overview — dashboard overview
router.get('/overview', statisticsController.getOverview);

// GET /api/statistics/revenue — revenue statistics
router.get('/revenue', statisticsController.getRevenue);

// GET /api/statistics/occupancy — occupancy rate statistics
router.get('/occupancy', statisticsController.getOccupancy);

// GET /api/statistics/bookings — booking statistics by status
router.get('/bookings', statisticsController.getBookingStats);

// GET /api/statistics/movies — movie performance
router.get('/movies', statisticsController.getMoviePerformance);

// GET /api/statistics/users — user growth
router.get('/users', statisticsController.getUserGrowth);

export default router;
