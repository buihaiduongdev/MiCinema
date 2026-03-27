import z from 'zod';
import { ROOM_TYPE, SEAT_TYPE } from '../constants/seat-types.js';

const objectIdString = z
  .string()
  .regex(/^[a-fA-F0-9]{24}$/, 'ID chi nhánh không hợp lệ');

export const seatConfigSchema = z.object({
  seatId: z.string(),
  row: z.string(),
  col: z.number(),
  type: z.nativeEnum(SEAT_TYPE),
  isActive: z.boolean().default(true),
});

/** Tối đa 26 hàng (nhãn A–Z) — khớp logic sinh ghế mặc định */
export const createRoomSchema = z.object({
  cinemaId: objectIdString,
  name: z.string().min(1, 'Tên phòng là bắt buộc').max(200),
  roomType: z.nativeEnum(ROOM_TYPE),
  rows: z.number().int().min(1).max(26),
  cols: z.number().int().min(1).max(40),
  seats: z.array(seatConfigSchema).optional(),
});

export const roomFilterSchema = z.object({
  cinemaId: z.string().regex(/^[a-fA-F0-9]{24}$/).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export const roomIdParamsSchema = z.object({
  id: objectIdString,
});

/** UC-29 (+ UC-28 ghế): không cho đổi cinemaId */
export const patchRoomSchema = z
  .object({
    name: z.string().min(1).max(200).optional(),
    roomType: z.nativeEnum(ROOM_TYPE).optional(),
    rows: z.number().int().min(1).max(26).optional(),
    cols: z.number().int().min(1).max(40).optional(),
    seats: z.array(seatConfigSchema).min(1).optional(),
    isActive: z.boolean().optional(),
  })
  .strict()
  .refine((o) => Object.keys(o).length > 0, {
    message: 'Cần ít nhất một trường để cập nhật',
  });

export const updateRoomSchema = createRoomSchema.partial();
export type SeatConfig = z.infer<typeof seatConfigSchema>;
export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;
export type PatchRoomInput = z.infer<typeof patchRoomSchema>;
export type RoomFilter = z.infer<typeof roomFilterSchema>;
export const roomSchema = createRoomSchema.extend({
  isActive: z.boolean(),
});
export type RoomType = z.infer<typeof roomSchema>;
