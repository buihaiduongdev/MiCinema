/**
 * LoyaltyHistory — Mongoose Model
 *
 * Fields: userId (ref User), points (positive=earn, negative=redeem),
 *         action (EARN|REDEEM|EXPIRE), description, bookingId? (ref Booking)
 *
 * Index: { userId, createdAt: -1 }
 */
