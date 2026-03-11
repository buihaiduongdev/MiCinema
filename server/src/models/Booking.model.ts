/**
 * Booking — Mongoose Model
 *
 * BookingItem sub-document (embedded):
 *   seatId, row, col, seatType, price
 *
 * Fields: userId (ref User), showtimeId (ref Showtime), totalAmount,
 *         status (PENDING|PAID|CANCELLED|COMPLETED), paymentMethod,
 *         items[], seatHoldExpiry (10 min hold), bookingCode (unique)
 *
 * Indexes: { userId, createdAt }, { showtimeId }, { seatHoldExpiry, status }, { bookingCode }
 */
