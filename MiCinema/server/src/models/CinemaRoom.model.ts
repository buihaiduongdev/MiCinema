import mongoose, { Schema, Document } from 'mongoose';
import { SEAT_TYPE, ROOM_TYPE, SeatType, RoomType } from '@shared/constants/seat-types';

export interface ISeat {
  row: string;
  col: number;
  type: SeatType;
  isActive: boolean;
}

export interface ICinemaRoom extends Document {
  name: string;
  rows: number;
  colsPerRow: number;
  type: RoomType;
  isActive: boolean;
  seats: ISeat[];
  createdAt: Date;
  updatedAt: Date;
}

const SeatSchema = new Schema<ISeat>({
  row: { type: String, required: true },
  col: { type: Number, required: true },
  type: {
    type: String,
    enum: Object.values(SEAT_TYPE),
    default: SEAT_TYPE.NORMAL,
  },
  isActive: { type: Boolean, default: true },
});

const CinemaRoomSchema = new Schema<ICinemaRoom>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    rows: {
      type: Number,
      required: true,
      min: 1,
      max: 26,
    },
    colsPerRow: {
      type: Number,
      required: true,
      min: 1,
      max: 20,
    },
    type: {
      type: String,
      enum: Object.values(ROOM_TYPE),
      default: ROOM_TYPE.STANDARD,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    seats: [SeatSchema],
  },
  {
    timestamps: true,
  }
);

CinemaRoomSchema.index({ name: 1 });

export const CinemaRoom = mongoose.model<ICinemaRoom>(
  'CinemaRoom',
  CinemaRoomSchema
);
