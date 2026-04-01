/**
 * Reviews Routes
 *
 * Public:  GET    /api/reviews/movie/:movieId         — Danh sách review theo phim
 * Public:  GET    /api/reviews/movie/:movieId/stats   — Thống kê rating phim
 * Auth:    GET    /api/reviews/movie/:movieId/my      — Review của user hiện tại cho phim
 * Auth:    GET    /api/reviews/my                     — Lịch sử review của user
 * Auth:    POST   /api/reviews                        — Tạo review mới
 * Auth:    PUT    /api/reviews/:id                    — Cập nhật review (owner)
 * Auth:    DELETE /api/reviews/:id                    — Xóa review (owner/admin)
 */

import { Router } from 'express';
import * as reviewController from './review.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { protect } from '../../middlewares/auth.middleware.js';
import {
  createReviewSchema,
  updateReviewSchema,
  reviewFilterSchema,
} from '@shared/schemas/review.schema.js';

const router = Router();

// --- PUBLIC ROUTES ---
router.get(
  '/movie/:movieId',
  validate({ query: reviewFilterSchema }),
  reviewController.getReviewsByMovie,
);
router.get('/movie/:movieId/stats', reviewController.getMovieRatingStats);

// --- PROTECTED ROUTES (Đăng nhập) ---
router.use(protect);

router.get('/movie/:movieId/my', reviewController.getMyReviewForMovie);
router.get('/my', reviewController.getMyReviews);
router.post('/', validate(createReviewSchema), reviewController.createReview);
router.put('/:id', validate(updateReviewSchema), reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);

export default router;
