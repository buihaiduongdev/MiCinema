import mongoose from 'mongoose';
import { Booking } from '../../models/Booking.model.js';
import { Showtime } from '../../models/Showtime.model.js';
import { User } from '../../models/User.model.js';
import { CreateBooking } from '@shared/schemas/booking.schema.js';
import type { AdminBookingListQuery } from '@shared/schemas/booking.schema.js';
import {
  BOOKING_STATUS,
  SHOWTIME_STATUS,
  FOOD_ORDER_STATUS,
} from '@shared/constants/statuses.js';
import { FoodOrder } from '../../models/FoodOrder.model.js';
import { Ticket } from '../../models/Ticket.model.js';
import { getSkip, getPaginationData } from '../../utils/pagination.js';
import { issueTicketsForPaidBooking } from '../tickets/ticket.service.js';
import { log } from 'node:console';

const httpError = (message: string, statusCode: number) => {
  const e = new Error(message) as Error & { statusCode: number };
  e.statusCode = statusCode;
  return e;
};

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * UC-24: Danh sách đặt vé (admin/staff), lọc theo suất / trạng thái / khách.
 */
export const getAdminList = async (query: AdminBookingListQuery) => {
  const { page, limit, showtimeId, status, userId, customerSearch } = query;
  const skip = getSkip(page, limit);

  const filter: Record<string, unknown> = {};
  if (showtimeId) filter.showtimeId = showtimeId;
  if (status) filter.status = status;

  const searchTerm = customerSearch?.trim();
  let searchUserIds: mongoose.Types.ObjectId[] | null = null;
  if (searchTerm) {
    const rx = new RegExp(escapeRegex(searchTerm), 'i');
    const users = await User.find({
      $or: [{ email: rx }, { fullName: rx }],
    })
      .select('_id')
      .limit(300)
      .lean();
    searchUserIds = users.map((u) => u._id as mongoose.Types.ObjectId);
    if (searchUserIds.length === 0) {
      return {
        bookings: [],
        meta: getPaginationData(0, page, limit),
      };
    }
  }

  if (userId) {
    const uid = new mongoose.Types.ObjectId(userId);
    if (searchUserIds) {
      const ok = searchUserIds.some((id) => id.equals(uid));
      if (!ok) {
        return {
          bookings: [],
          meta: getPaginationData(0, page, limit),
        };
      }
    }
    filter.userId = uid;
  } else if (searchUserIds) {
    filter.userId = { $in: searchUserIds };
  }

  const [bookings, totalItems] = await Promise.all([
    Booking.find(filter)
      .populate({ path: 'userId', select: 'email fullName phone' })
      .populate({
        path: 'showtimeId',
        populate: [
          { path: 'movieId', select: 'title poster slug' },
          { path: 'roomId', select: 'name' },
        ],
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Booking.countDocuments(filter),
  ]);

  return {
    bookings,
    meta: getPaginationData(totalItems, page, limit),
  };
};

export const getAllByUser = async (userId: string, page = 1, limit = 10) => {
  const skip = getSkip(page, limit);
  const [bookings, totalItems] = await Promise.all([
    Booking.find({ userId })
      .populate({
        path: 'showtimeId',
        populate: [
          { path: 'movieId', select: 'title poster slug' },
          { path: 'roomId', select: 'name' },
        ],
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Booking.countDocuments({ userId }),
  ]);
  const meta = getPaginationData(totalItems, page, limit);
  return { bookings, meta };
};

export const getById = async (id: string): Promise<any | null> => {
  const booking = await Booking.findById(id)
    .populate({
      path: 'showtimeId',
      populate: [{ path: 'movieId' }, { path: 'roomId' }],
    })
    .lean();

  if (!booking) return null;

  const tickets = await Ticket.find({
    bookingId: new mongoose.Types.ObjectId(id),
  }).lean();

  return { ...booking, tickets };
};

export const getSeatMap = async (showtimeId: string) => {
  await cleanupExpiredBookings();

  const showtime = await Showtime.findById(showtimeId).populate([
    'roomId',
    'movieId',
  ]);
  if (!showtime) throw new Error('Không tìm thấy suất chiếu');

  const bookedTickets = await Booking.find({
    showtimeId,
    status: {
      $in: [
        BOOKING_STATUS.COMPLETED,
        BOOKING_STATUS.PAID,
        BOOKING_STATUS.PENDING,
      ],
    },
  });

  const bookedSeatIds = new Set(
    bookedTickets.flatMap((bt) => bt.seats.map((s) => s.seatId)),
  );

  return {
    showtime,
    bookedSeatIds: Array.from(bookedSeatIds),
  };
};

export const createBooking = async (userId: string, data: CreateBooking) => {
  const { showtimeId, seats } = data;

  const showtime = await Showtime.findById(showtimeId);
  if (!showtime) throw new Error('Suất chiếu không tồn tại');

  const existingBookings = await Booking.find({
    showtimeId,
    status: {
      $in: [
        BOOKING_STATUS.COMPLETED,
        BOOKING_STATUS.PAID,
        BOOKING_STATUS.PENDING,
      ],
    },
    'seats.seatId': { $in: seats.map((s) => s.seatId) },
  });

  if (existingBookings.length > 0)
    throw new Error('Một họăc nhiều ghế  đã có người đặt');

  const totalPrice = seats.reduce((sum, seat) => sum + seat.price, 0);

  const booking = await Booking.create({
    userId,
    showtimeId,
    seats,
    totalPrice,
    status: BOOKING_STATUS.PENDING,
  });

  return booking;
};

/**
 * Xác nhận thanh toán: PENDING → PAID (quầy / staff, hoặc gọi từ tích hợp cổng thanh toán).
 * Idempotent: đã PAID thì trả về booking hiện tại.
 */
export const markBookingPaid = async (bookingId: string) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw httpError('Không tìm thấy đặt vé', 404);

  if (booking.status === BOOKING_STATUS.PAID) {
    await issueTicketsForPaidBooking(booking);
    const paid = await getById(bookingId);
    if (!paid) throw httpError('Không tìm thấy đặt vé', 404);
    return paid;
  }

  if (booking.status !== BOOKING_STATUS.PENDING) {
    throw httpError(
      'Chỉ có thể xác nhận thanh toán khi đặt vé đang ở trạng thái chờ thanh toán',
      400,
    );
  }

  const showtime = await Showtime.findById(booking.showtimeId);
  if (!showtime) throw httpError('Suất chiếu không tồn tại', 400);

  if (
    showtime.status === SHOWTIME_STATUS.CANCELLED ||
    showtime.status === SHOWTIME_STATUS.FINISHED
  ) {
    throw httpError(
      'Suất chiếu đã kết thúc hoặc đã huỷ, không thể xác nhận thanh toán',
      400,
    );
  }

  booking.status = BOOKING_STATUS.PAID;
  await booking.save();

  await issueTicketsForPaidBooking(booking);

  const updated = await getById(bookingId);
  if (!updated) throw httpError('Không tìm thấy đặt vé', 404);
  return updated;
};

export const cleanupExpiredBookings = async () => {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

  // 1. Tìm các booking hết hạn
  const expiredBookings = await Booking.find({
    status: BOOKING_STATUS.PENDING,
    createdAt: { $lt: tenMinutesAgo },
  }).select('_id');

  if (expiredBookings.length === 0) return;

  const expiredIds = expiredBookings.map((b) => b._id);

  // 2. Hủy các booking này
  await Booking.updateMany(
    { _id: { $in: expiredIds } },
    { $set: { status: BOOKING_STATUS.CANCELLED } },
  );

  // 3. Hủy luôn các đơn hàng đồ ăn liên quan
  await FoodOrder.updateMany(
    { bookingId: { $in: expiredIds.map((id) => id.toString()) } },
    { $set: { status: FOOD_ORDER_STATUS.CANCELLED } },
  );

  console.log(`Đã hủy ${expiredIds.length} đơn đặt vé và đồ ăn kèm hết hạn.`);
};
export const cancelBooking = async (userId: string, bookingId: string) => {
  const booking = await Booking.findOne({ _id: bookingId, userId });
  if (!booking) throw httpError('Không tìm thấy đơn đặt vé', 404);

  if (booking.status === 'PAID') {
    throw httpError('Không thể hủy vé đã thanh toán', 400);
  }

  booking.status = BOOKING_STATUS.CANCELLED;
  await booking.save();

  await FoodOrder.updateMany(
    { bookingId: bookingId },
    { $set: { status: FOOD_ORDER_STATUS.CANCELLED } },
  );

  return booking;
};
