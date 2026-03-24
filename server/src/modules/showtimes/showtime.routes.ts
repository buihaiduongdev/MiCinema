/**
 * Showtimes Routes
 *
 * Public:  GET    /api/showtimes                     — Danh sách + lọc + phân trang
 * Public:  GET    /api/showtimes/movie/:movieId       — Lịch chiếu theo phim (nhóm theo ngày)
 * Public:  GET    /api/showtimes/cinema/:cinemaId     — Lịch chiếu theo chi nhánh
 * Public:  GET    /api/showtimes/:id                  — Chi tiết suất chiếu
 * Staff+:  POST   /api/showtimes                     — Tạo suất chiếu
 * Staff+:  PUT    /api/showtimes/:id                  — Cập nhật suất chiếu
 * Staff+:  DELETE /api/showtimes/:id/cancel           — Huỷ suất chiếu + hoàn vé
 *
 * ⚠️ Named routes (movie, cinema) đặt TRƯỚC /:id
 */

import { Router } from 'express';
import * as showtimeController from './showtime.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { protect, restrictTo } from '../../middlewares/auth.middleware.js';
import {
  createShowtimeSchema,
  updateShowtimeSchema,
  showtimeFilterSchema,
} from '@shared/schemas/showtime.schema.js';

const router = Router();

// --- PUBLIC ROUTES ---
router.get('/movie/:movieId', showtimeController.getShowtimesByMovie);
router.get('/cinema/:cinemaId', showtimeController.getShowtimesByCinema);

router.get(
  '/',
  validate({ query: showtimeFilterSchema }),
  showtimeController.getShowtimes,
);

router.get('/:id', showtimeController.getShowtimeById);

// --- PROTECTED ROUTES (Staff + Admin) ---
router.use(protect);
router.use(restrictTo('STAFF', 'ADMIN'));

router.post('/', validate(createShowtimeSchema), showtimeController.createShowtime);
router.put(
  '/:id',
  validate(updateShowtimeSchema),
  showtimeController.updateShowtime,
);
router.delete('/:id/cancel', showtimeController.cancelShowtime);

export default router;
