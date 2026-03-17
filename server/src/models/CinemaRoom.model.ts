import mongoose, { Schema, Document } from 'mongoose';
import { ROOM_TYPE, SEAT_TYPE } from '@shared/constants/seat-types.js';
import { RoomType } from '@shared/schemas/room.schema';

export interface ICinemaRoom extends RoomType, Document {}

const cinemaRoomSchema = new Schema<ICinemaRoom>(
  {
    name: { type: String, required: true, unique: true },
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
export const CinemaRoom = mongoose.model<ICinemaRoom>(
  'CinemaRoom',
  cinemaRoomSchema,
);
