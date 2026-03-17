import z from 'zod';
import { SHOWTIME_STATUS } from '../constants/statuses.js';

export const createShowtimeSchema = z.object({
  movieId: z.string(),
  roomId: z.string(),
  startTime: z.string().datetime(),
  ticketPrice: z.number().min(0, 'Giá vé không được âm'),
});

export const updateShowtimeSchema = createShowtimeSchema.partial();

export const showtimeSchema = createShowtimeSchema.extend({
  status: z.nativeEnum(SHOWTIME_STATUS),
});

export type CreateShowtimeInput = z.infer<typeof createShowtimeSchema>;
export type UpdateShowtimeInput = z.infer<typeof updateShowtimeSchema>;
export type ShowtimeType = z.infer<typeof showtimeSchema>;
