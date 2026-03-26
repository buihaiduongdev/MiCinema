import mongoose, { Document, Schema } from 'mongoose';
import { SHOWTIME_STATUS } from '@shared/constants/statuses';

export interface IShowtime extends Document {
  movieId: mongoose.Types.ObjectId;
  cinemaId: mongoose.Types.ObjectId;
  roomId: mongoose.Types.ObjectId;
  startTime: Date;
  ticketPrice: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const showtimeSchema = new Schema<IShowtime>(
  {
    movieId: {
      type: Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    cinemaId: {
      type: Schema.Types.ObjectId,
      ref: 'Cinema',
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

// Lọc suất chiếu theo phim + thời gian
showtimeSchema.index({ movieId: 1, startTime: 1 });
// Lọc theo phòng + thời gian (kiểm tra trùng lịch)
showtimeSchema.index({ roomId: 1, startTime: 1 });
// Lọc theo chi nhánh rạp
showtimeSchema.index({ cinemaId: 1, startTime: 1 });
// Lọc theo trạng thái
showtimeSchema.index({ status: 1 });

export const Showtime = mongoose.model<IShowtime>('Showtime', showtimeSchema);
