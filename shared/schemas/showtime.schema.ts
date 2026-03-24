import z from 'zod';
import { SHOWTIME_STATUS } from '../constants/statuses.js';
import { objectIdSchema } from './common.schema.js';

/**
 * Schema tạo suất chiếu
 * cinemaId để liên kết trực tiếp với chi nhánh rạp (denormalized cho lọc nhanh)
 */
export const createShowtimeSchema = z.object({
  movieId: objectIdSchema,
  cinemaId: objectIdSchema,
  roomId: objectIdSchema,
  startTime: z.string().datetime('Thời gian chiếu không hợp lệ'),
  ticketPrice: z.number().min(0, 'Giá vé không được âm'),
});

export const updateShowtimeSchema = createShowtimeSchema.partial();

export const showtimeSchema = createShowtimeSchema.extend({
  status: z.nativeEnum(SHOWTIME_STATUS),
});

/**
 * Schema lọc suất chiếu — dùng cho query params
 */
export const showtimeFilterSchema = z.object({
  movieId: z.string().optional(),
  cinemaId: z.string().optional(),
  roomId: z.string().optional(),
  date: z.string().optional(),           // YYYY-MM-DD — lọc theo ngày
  status: z.nativeEnum(SHOWTIME_STATUS).optional(),
  fromDate: z.string().optional(),       // Lọc khoảng thời gian
  toDate: z.string().optional(),
  sortBy: z
    .enum(['startTime', 'ticketPrice', 'createdAt'])
    .default('startTime'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export type CreateShowtimeInput = z.infer<typeof createShowtimeSchema>;
export type UpdateShowtimeInput = z.infer<typeof updateShowtimeSchema>;
export type ShowtimeType = z.infer<typeof showtimeSchema>;
export type ShowtimeFilter = z.infer<typeof showtimeFilterSchema>;
