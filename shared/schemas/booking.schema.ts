import z from 'zod';
import { SEAT_TYPE } from '../constants/seat-types.js';
import { BOOKING_STATUS } from '../constants/statuses.js';
import { paginationSchema, objectIdSchema } from './common.schema.js';

export const seatSelectionSchema = z.object({
  seatId: z.string(),
  row: z.string(),
  col: z.number(),
  type: z.nativeEnum(SEAT_TYPE),
  price: z.number(),
});

export const createBookingSchema = z.object({
  showtimeId: z.string(),
  seats: z.array(seatSelectionSchema).min(1, 'Phải lựa chọn ít nhất 1 ghế'),
});

export const cancelBookingSchema = z.object({
  bookingId: z.string(),
  reason: z.string().optional(),
});
export const bookingSchema = createBookingSchema.extend({
  _id: z.string(),
  userId: z.string(),
  status: z.nativeEnum(BOOKING_STATUS),
  totalPrice: z.number(),
  createdAt: z.date().or(z.string()),
});
export type SeatSelection = z.infer<typeof seatSelectionSchema>;
export type CreateBooking = z.infer<typeof createBookingSchema>;
export type CancelBooking = z.infer<typeof cancelBookingSchema>;
export type BookingType = z.infer<typeof bookingSchema>;

/** UC-24: admin lọc theo suất chiếu, trạng thái đặt vé, khách (userId hoặc tìm email/tên) */
export const adminBookingListQuerySchema = paginationSchema.extend({
  showtimeId: objectIdSchema.optional(),
  status: z.nativeEnum(BOOKING_STATUS).optional(),
  userId: objectIdSchema.optional(),
  customerSearch: z.string().trim().max(200).optional(),
});

export type AdminBookingListQuery = z.infer<typeof adminBookingListQuerySchema>;
