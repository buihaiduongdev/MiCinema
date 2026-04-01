import mongoose, { Schema, Document } from 'mongoose';
import { ROOM_TYPE, SEAT_TYPE } from '@shared/constants/seat-types.js';
import type {
  RoomTypeValue,
  SeatTypeValue,
} from '@shared/constants/seat-types.js';

export interface ICinemaRoom extends Document {
  cinemaId: mongoose.Types.ObjectId;
  name: string;
  roomType: RoomTypeValue;
  rows: number;
  cols: number;
  seats: Array<{
    seatId: string;
    row: string;
    col: number;
    type: SeatTypeValue;
    isActive: boolean;
  }>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const cinemaRoomSchema = new Schema<ICinemaRoom>(
  {
    cinemaId: {
      type: Schema.Types.ObjectId,
      ref: 'Cinema',
      required: true,
    },
    name: { type: String, required: true },
    roomType: {
      type: String,
      enum: Object.values(ROOM_TYPE),
      default: ROOM_TYPE.STANDARD,
    },
    rows: { type: Number, required: true },
    cols: { type: Number, required: true },
    seats: [
      {
        seatId: { type: String, required: true },
        row: { type: String, required: true },
        col: { type: Number, required: true },
        type: {
          type: String,
          enum: Object.values(SEAT_TYPE),
          default: SEAT_TYPE.NORMAL,
        },
        isActive: { type: Boolean, default: true },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

cinemaRoomSchema.index({ cinemaId: 1, name: 1 }, { unique: true });

export const CinemaRoom = mongoose.model<ICinemaRoom>(
  'CinemaRoom',
  cinemaRoomSchema,
);
