/**
 * FoodOrder — Mongoose Model
 *
 * OrderItem sub-document (embedded):
 *   productId, productName, quantity, unitPrice
 *
 * Fields: userId (ref User), bookingId? (ref Booking, optional),
 *         items[], totalAmount, status (PENDING|PAID|CANCELLED)
 */
