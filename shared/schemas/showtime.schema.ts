/**
 * Showtime Validation Schemas (Zod)
 *
 * Export:
 * - createShowtimeSchema: z.object({ maPhim, maPhong, gioChieu: z.string().datetime(), giaVe })
 * - updateShowtimeSchema: createShowtimeSchema.partial()
 *
 * Type exports:
 * - CreateShowtimeInput, UpdateShowtimeInput
 */
