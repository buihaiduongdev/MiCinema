import mongoose, { Document, Schema } from 'mongoose';
import { SHOWTIME_STATUS } from '@shared/constants/statuses';
import { ShowtimeType } from '@shared/schemas/showtime.schema';

export interface IShowtime
  extends Omit<ShowtimeType, 'movieId' | 'roomId' | 'startTime'>, Document {
  movieId: mongoose.Types.ObjectId;
  roomId: mongoose.Types.ObjectId;
  startTime: Date;
}
const showtimeSchema = new Schema<IShowtime>(
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
  },
  {
    timestamps: true,
  },
);
showtimeSchema.index({ movieId: 1, startTime: 1 });
showtimeSchema.index({ roomId: 1, startTime: 1 });
export const Showtime = mongoose.model<IShowtime>('Showtime', showtimeSchema);
