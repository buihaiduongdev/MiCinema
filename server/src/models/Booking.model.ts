import mongoose, { Document, Schema } from 'mongoose';
import { BookingType } from '@shared/schemas/booking.schema';
import { SEAT_TYPE } from '@shared/constants/seat-types';
import { BOOKING_STATUS } from '@shared/constants/statuses';

export interface IBooking
  extends Omit<BookingType, 'userId' | 'showtimeId'>, Document {
  userId: mongoose.Types.ObjectId;
  showtimeId: mongoose.Types.ObjectId;
}

const bookingSchema = new Schema<IBooking>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    showtimeId: {
      type: Schema.Types.ObjectId,
      ref: 'Showtime',
      required: true,
    },
    seats: [
      {
        seatId: { type: String, required: true },
        row: { type: String, required: true },
        col: { type: Number, required: true },
        type: {
          type: String,
          enum: Object.values(SEAT_TYPE),
          required: true,
        },
        price: { type: Number, required: true, min: 0 },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.PENDING,
    },
  },
  {
    timestamps: true,
  },
);
bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ showtimeId: 1 });
export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
