import { randomBytes } from 'node:crypto';
import { Ticket } from '../../models/Ticket.model.js';
import { Booking } from '../../models/Booking.model.js';
import type { IBooking } from '../../models/Booking.model.js';
import type { TicketRefundBody } from '@shared/schemas/ticket.schema.js';
import {
  BOOKING_STATUS,
  TICKET_STATUS,
} from '@shared/constants/statuses.js';

function newTicketCode(): string {
  return randomBytes(12).toString('base64url').replace(/=/g, '');
}

const httpError = (message: string, statusCode: number) => {
  const e = new Error(message) as Error & { statusCode: number };
  e.statusCode = statusCode;
  return e;
};

async function loadTicketForCheckInResponse(id: string) {
  return Ticket.findById(id)
    .populate({ path: 'userId', select: 'email fullName phone' })
    .populate({ path: 'bookingId', select: 'status totalPrice' })
    .populate({
      path: 'showtimeId',
      populate: [
        { path: 'movieId', select: 'title poster' },
        { path: 'roomId', select: 'name' },
      ],
    });
}

/**
 * UC-25: Check-in vé — ISSUED → USED, ghi usedAt.
 * Idempotent: vé đã USED → trả về cùng dữ liệu, alreadyCheckedIn: true.
 */
export const checkInByTicketCode = async (ticketCode: string) => {
  const code = ticketCode.trim();
  if (!code) throw httpError('Thiếu mã vé', 400);

  const ticket = await Ticket.findOne({ ticketCode: code });
  if (!ticket) throw httpError('Không tìm thấy vé', 404);

  if (ticket.status === TICKET_STATUS.USED) {
    const populated = await loadTicketForCheckInResponse(
      ticket._id.toString(),
    );
    return { ticket: populated, alreadyCheckedIn: true as const };
  }

  const booking = await Booking.findById(ticket.bookingId)
    .select('status')
    .lean();
  if (!booking) throw httpError('Không tìm thấy đặt vé', 400);
  if (booking.status === BOOKING_STATUS.CANCELLED) {
    throw httpError('Đặt vé đã huỷ, không thể check-in', 400);
  }
  if (
    booking.status !== BOOKING_STATUS.PAID &&
    booking.status !== BOOKING_STATUS.COMPLETED
  ) {
    throw httpError('Đặt vé chưa thanh toán, không thể check-in', 400);
  }

  if (ticket.status !== TICKET_STATUS.ISSUED) {
    throw httpError('Vé không thể check-in (đã huỷ hoặc đã hoàn tiền)', 400);
  }

  ticket.status = TICKET_STATUS.USED;
  ticket.usedAt = new Date();
  await ticket.save();

  const populated = await loadTicketForCheckInResponse(ticket._id.toString());
  return { ticket: populated, alreadyCheckedIn: false as const };
};

/**
 * UC-26: Huỷ vé + hoàn tiền — REFUNDED, gỡ ghế khỏi Booking, giảm totalPrice;
 * hết ghế → Booking CANCELLED. Thống kê dùng totalPrice & $size seats nên tự khớp.
 */
export const refundTicket = async (ticketId: string, body: TicketRefundBody) => {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) throw httpError('Không tìm thấy vé', 404);

  if (
    ticket.status === TICKET_STATUS.REFUNDED ||
    ticket.status === TICKET_STATUS.CANCELLED
  ) {
    throw httpError('Vé đã huỷ hoặc đã hoàn tiền', 400);
  }
  if (ticket.status === TICKET_STATUS.USED) {
    throw httpError('Vé đã sử dụng, không thể hoàn tiền', 400);
  }
  if (ticket.status !== TICKET_STATUS.ISSUED) {
    throw httpError('Vé không thể hoàn tiền', 400);
  }

  const booking = await Booking.findById(ticket.bookingId);
  if (!booking) throw httpError('Không tìm thấy đặt vé', 400);

  if (
    booking.status !== BOOKING_STATUS.PAID &&
    booking.status !== BOOKING_STATUS.COMPLETED
  ) {
    throw httpError('Đặt vé không ở trạng thái đã thanh toán', 400);
  }

  const amount =
    body.refundAmount !== undefined ? body.refundAmount : ticket.price;
  if (amount > ticket.price) {
    throw httpError('Số tiền hoàn không được vượt quá giá vé', 400);
  }

  const seatIdx = booking.seats.findIndex((s) => s.seatId === ticket.seatId);
  if (seatIdx === -1) {
    throw httpError('Ghế không còn trong đặt vé (dữ liệu không khớp)', 400);
  }

  booking.seats.splice(seatIdx, 1);
  booking.totalPrice = Math.max(0, booking.totalPrice - amount);
  if (booking.seats.length === 0) {
    booking.status = BOOKING_STATUS.CANCELLED;
    booking.totalPrice = 0;
  } else if (booking.status === BOOKING_STATUS.COMPLETED) {
    booking.status = BOOKING_STATUS.PAID;
  }
  await booking.save();

  ticket.status = TICKET_STATUS.REFUNDED;
  ticket.refundAmount = amount;
  ticket.refundedAt = new Date();
  ticket.cancelReason = body.reason?.trim() || null;
  await ticket.save();

  const populatedTicket = await loadTicketForCheckInResponse(
    ticket._id.toString(),
  );
  const populatedBooking = await Booking.findById(booking._id)
    .populate({
      path: 'showtimeId',
      select: 'startTime',
      populate: { path: 'movieId', select: 'title' },
    })
    .select('status totalPrice seats showtimeId userId createdAt');

  return { ticket: populatedTicket, booking: populatedBooking };
};

/**
 * Sinh vé (mỗi ghế một Ticket) khi booking đã PAID.
 * Idempotent / bù dữ liệu: chỉ tạo vé cho ghế chưa có bản ghi.
 */
export const issueTicketsForPaidBooking = async (booking: IBooking) => {
  if (!booking.seats?.length) return;

  const bookingId = booking._id;
  const existing = await Ticket.find({ bookingId }).select('seatId').lean();
  const issuedSeatIds = new Set(existing.map((t) => t.seatId));

  const toCreate = booking.seats.filter((s) => !issuedSeatIds.has(s.seatId));
  if (toCreate.length === 0) return;

  const docs = toCreate.map((seat) => ({
    bookingId,
    userId: booking.userId,
    showtimeId: booking.showtimeId,
    seatId: seat.seatId,
    row: seat.row,
    col: seat.col,
    type: seat.type,
    price: seat.price,
    ticketCode: newTicketCode(),
    status: TICKET_STATUS.ISSUED,
  }));

  await Ticket.insertMany(docs);
};
