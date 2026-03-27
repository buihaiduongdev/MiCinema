import mongoose, { Document, Schema } from 'mongoose';
import { SEAT_TYPE } from '@shared/constants/seat-types';
import { TICKET_STATUS } from '@shared/constants/statuses';

export interface ITicket extends Document {
  bookingId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  showtimeId: mongoose.Types.ObjectId;
  seatId: string;
  row: string;
  col: number;
  type: (typeof SEAT_TYPE)[keyof typeof SEAT_TYPE];
  price: number;
  ticketCode: string;
  status: (typeof TICKET_STATUS)[keyof typeof TICKET_STATUS];
  usedAt?: Date | null;
  refundAmount?: number | null;
  refundedAt?: Date | null;
  cancelReason?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const ticketSchema = new Schema<ITicket>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
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
    seatId: { type: String, required: true },
    row: { type: String, required: true },
    col: { type: Number, required: true },
    type: {
      type: String,
      enum: Object.values(SEAT_TYPE),
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    ticketCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(TICKET_STATUS),
      default: TICKET_STATUS.ISSUED,
    },
    usedAt: { type: Date, default: null },
    refundAmount: { type: Number, min: 0, default: null },
    refundedAt: { type: Date, default: null },
    cancelReason: { type: String, trim: true, maxlength: 500, default: null },
  },
  { timestamps: true },
);

ticketSchema.index({ bookingId: 1 });
ticketSchema.index({ userId: 1, createdAt: -1 });
ticketSchema.index({ showtimeId: 1 });
ticketSchema.index({ showtimeId: 1, seatId: 1, status: 1 });

export const Ticket = mongoose.model<ITicket>('Ticket', ticketSchema);
