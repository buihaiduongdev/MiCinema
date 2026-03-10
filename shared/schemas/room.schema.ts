/**
 * Room Validation Schemas (Zod)
 * 
 * Export:
 * - createRoomSchema: z.object({ tenPhong, soHang, soCotMoiHang, loaiPhong })
 * - seatConfigSchema: z.object({ hang, cot, loaiGhe, trangThai })
 * - updateRoomSchema: createRoomSchema.partial()
 * 
 * Type exports:
 * - CreateRoomInput, SeatConfig, UpdateRoomInput
 */
