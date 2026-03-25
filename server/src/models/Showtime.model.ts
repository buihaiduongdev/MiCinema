import mongoose, { Schema, Document, Types } from 'mongoose';
import {
  SHOWTIME_STATUS,
  ShowtimeStatus,
  SEAT_STATUS,
  SeatStatus,
} from '@shared/constants/statuses';

export interface ISeatStatus {
  seatId: string;
  status: SeatStatus;
  heldUntil?: Date;
  bookingId?: Types.ObjectId;
}

export interface IShowtime extends Document {
  movieId: Types.ObjectId;
  roomId: Types.ObjectId;
  startTime: Date;
  ticketPrice: number;
  status: ShowtimeStatus;
  seatStatus: ISeatStatus[];
  createdAt: Date;
  updatedAt: Date;
}

const SeatStatusSchema = new Schema<ISeatStatus>({
  seatId: { type: String, required: true },
  status: {
    type: String,
    enum: Object.values(SEAT_STATUS),
    default: SEAT_STATUS.AVAILABLE,
  },
  heldUntil: { type: Date },
  bookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },
});

const ShowtimeSchema = new Schema<IShowtime>(
  {
    movieId: {
      type: Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    roomId: {
      type: Schema.Types.ObjectId,
      ref: 'CinemaRoom',
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    ticketPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: Object.values(SHOWTIME_STATUS),
      default: SHOWTIME_STATUS.OPEN,
    },
    seatStatus: [SeatStatusSchema],
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
  }
);

ShowtimeSchema.index({ movieId: 1, startTime: 1 });
ShowtimeSchema.index({ roomId: 1, startTime: 1 });
ShowtimeSchema.index({ startTime: 1, status: 1 });
ShowtimeSchema.index({ 'seatStatus.seatId': 1 });

export const Showtime = mongoose.model<IShowtime>('Showtime', ShowtimeSchema);
