import z from 'zod';
import { SEAT_TYPE } from '../constants/seat-types.js';
import { TICKET_STATUS } from '../constants/statuses.js';

export const ticketSchema = z.object({
  bookingId: z.string(),
  userId: z.string(),
  showtimeId: z.string(),
  seatId: z.string(),
  row: z.string(),
  col: z.number(),
  type: z.nativeEnum(SEAT_TYPE),
  price: z.number(),
  ticketCode: z.string(),
  status: z.nativeEnum(TICKET_STATUS),
  usedAt: z.date().optional().nullable(),
  refundAmount: z.number().optional().nullable(),
  refundedAt: z.date().optional().nullable(),
  cancelReason: z.string().optional().nullable(),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()).optional(),
});

export type TicketType = z.infer<typeof ticketSchema>;

/** UC-25: check-in theo mã vé (quét QR / nhập tay) */
export const ticketCheckInBodySchema = z.object({
  ticketCode: z.string().trim().min(1, 'Thiếu mã vé'),
});

export type TicketCheckInBody = z.infer<typeof ticketCheckInBodySchema>;

/** UC-26: hoàn tiền / huỷ vé — số tiền mặc định = giá vé nếu không gửi */
export const ticketRefundBodySchema = z.object({
  refundAmount: z.number().min(0).optional(),
  reason: z.string().trim().max(500).optional(),
});

export type TicketRefundBody = z.infer<typeof ticketRefundBodySchema>;
