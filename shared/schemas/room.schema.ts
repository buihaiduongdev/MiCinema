import z from 'zod';
import { ROOM_TYPE, SEAT_TYPE } from '../constants/seat-types.js';

export const seatConfigSchema = z.object({
  seatId: z.string(),
  row: z.string(),
  col: z.number(),
  type: z.nativeEnum(SEAT_TYPE),
  isActive: z.boolean().default(true),
});

export const createRoomSchema = z.object({
  name: z.string().min(1, 'Tên phòng là bắt buộc'),
  roomType: z.nativeEnum(ROOM_TYPE),
  rows: z.number().int().positive(),
  cols: z.number().int().positive(),
  seats: z.array(seatConfigSchema).optional(),
});

export const updateRoomSchema = createRoomSchema.partial();
export type SeatConfig = z.infer<typeof seatConfigSchema>;
export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;
export const roomSchema = createRoomSchema.extend({
  isActive: z.boolean(),
});
export type RoomType = z.infer<typeof roomSchema>;
