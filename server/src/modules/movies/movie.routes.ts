/**
 * Movies Routes
 *
 * Public:  GET    /api/movies                — Danh sách phim + lọc + search
 * Public:  GET    /api/movies/now-showing     — Phim đang chiếu
 * Public:  GET    /api/movies/upcoming        — Phim sắp chiếu
 * Public:  GET    /api/movies/slug/:slug      — Chi tiết theo slug (SEO)
 * Public:  GET    /api/movies/:id             — Chi tiết theo ID
 * Public:  GET    /api/movies/:id/related     — Phim liên quan
 * Staff+:  POST   /api/movies                — Tạo phim mới
 * Staff+:  PUT    /api/movies/:id             — Cập nhật phim
 * Staff+:  DELETE /api/movies/:id             — Xóa phim
 *
 * ⚠️ Routes cụ thể (now-showing, upcoming, slug) đặt TRƯỚC /:id
 *    vì Express match từ trên xuống
 */

import { Router } from 'express';
import * as movieController from './movie.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { protect, restrictTo } from '../../middlewares/auth.middleware.js';
import {
  createMovieSchema,
  updateMovieSchema,
  movieFilterSchema,
} from '@shared/schemas/movie.schema.js';

const router = Router();

// --- PUBLIC ROUTES ---
// ⚠️ Đặt named routes TRƯỚC /:id để tránh bị Express nhầm
router.get('/now-showing', movieController.getNowShowing);
router.get('/upcoming', movieController.getUpcoming);
router.get('/countries', movieController.getCountries);
router.get('/years', movieController.getYears);
router.get('/slug/:slug', movieController.getMovieBySlug);

router.get(
  '/',
  validate({ query: movieFilterSchema }),
  movieController.getMovies,
);

router.get('/:id', movieController.getMovieById);
router.get('/:id/related', movieController.getRelatedMovies);

// --- PROTECTED ROUTES (Staff + Admin) ---
router.use(protect);
router.use(restrictTo('STAFF', 'ADMIN'));

router.post('/', validate(createMovieSchema), movieController.createMovie);
router.put('/:id', validate(updateMovieSchema), movieController.updateMovie);
router.delete('/:id', movieController.deleteMovie);

export default router;
