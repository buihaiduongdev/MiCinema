/**
 * Booking Validation Schemas (Zod)
 * 
 * Export:
 * - createBookingSchema: z.object({ maXuatChieu, danhSachGhe: z.array({ maGhe, loaiGhe }) })
 * - seatSelectionSchema: z.object({ maGhe, hang, cot, loaiGhe, giaVe })
 * - cancelBookingSchema: z.object({ maDatVe, lyDo? })
 * 
 * Type exports:
 * - CreateBookingInput, SeatSelection, CancelBookingInput
 */
