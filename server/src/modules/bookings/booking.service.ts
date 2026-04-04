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
import * as loyaltyService from '../loyalty/loyalty.service.js';
import { LOYALTY_ACTION, MEMBERSHIP_TIER } from '@shared/constants/statuses.js';

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

  // === Tự động cộng điểm loyalty sau khi thanh toán ===
  try {
    const POINTS_PER_TICKET = 10;
    const pointsEarned = booking.seats.length * POINTS_PER_TICKET;
    if (pointsEarned > 0) {
      await loyaltyService.create({
        userId: booking.userId.toString(),
        points: pointsEarned,
        action: LOYALTY_ACTION.EARN,
        description: `Tích điểm ${booking.seats.length} vé đặt #${bookingId.slice(-8).toUpperCase()} (+${pointsEarned} điểm)`,
        bookingId: bookingId,
      });
    }
  } catch (e) {
    // Không throw — lỗi loyalty không được phép block việc thanh toán
    console.error('[markBookingPaid] Loyalty earn error:', e);
  }

  const updated = await getById(bookingId);
  if (!updated) throw httpError('Không tìm thấy đặt vé', 404);
  return updated;
};

// ====== Discount helpers ======

/** Tỷ lệ giảm giá theo hạng thành viên */
const TIER_DISCOUNT_RATE = {
  [MEMBERSHIP_TIER.BRONZE]: 0, // 0%
  [MEMBERSHIP_TIER.SILVER]: 0.05, // 5%
  [MEMBERSHIP_TIER.GOLD]: 0.1, // 10%
} as const;

const POINTS_TO_VND = 1000; // 1 điểm = 1000đ khi quy đổi

/**
 * Tính kết quả giảm giá trước khi khách xác nhận thanh toán.
 * - Giảm theo hạng thành viên (luôn áp dụng).
 * - Tiêu điểm thêm (tuỳ khách chọn), bị giới hạn ≤ 50% giá sau giảm tier.
 */
export const calculateDiscount = async (
  userId: string,
  basePrice: number,
  redeemPoints: number = 0,
) => {
  const user = await User.findById(userId)
    .select('loyaltyPoints membershipTier')
    .lean();
  if (!user) throw httpError('Người dùng không tồn tại', 404);

  const tier =
    ((user as any).membershipTier as keyof typeof TIER_DISCOUNT_RATE) ||
    MEMBERSHIP_TIER.BRONZE;
  const tierRate = TIER_DISCOUNT_RATE[tier] ?? 0;
  const tierDiscount = Math.round(basePrice * tierRate);
  const priceAfterTier = basePrice - tierDiscount;

  // Giới hạn điểm có thể dùng
  const maxRedeemablePoints = Math.min(
    (user as any).loyaltyPoints as number,
    Math.floor((priceAfterTier * 0.5) / POINTS_TO_VND), // tối đa 50% giá sau tier
  );
  const safeRedeemPoints = Math.max(
    0,
    Math.min(redeemPoints, maxRedeemablePoints),
  );
  const pointsDiscount = safeRedeemPoints * POINTS_TO_VND;

  const finalPrice = Math.max(0, priceAfterTier - pointsDiscount);

  return {
    basePrice,
    membershipTier: tier,
    tierDiscountRate: tierRate,
    tierDiscount,
    priceAfterTier,
    availablePoints: (user as any).loyaltyPoints as number,
    maxRedeemablePoints,
    redeemPoints: safeRedeemPoints,
    pointsDiscount,
    finalPrice,
    pointsPerVnd: 1 / POINTS_TO_VND,
  };
};

/**
 * Tiêu điểm và trả về số tiền giảm + ghi lịch sử.
 * Gọi sau khi PATCH confirm-payment (trong markBookingPaid).
 */
export const redeemLoyaltyPoints = async (
  userId: string,
  bookingId: string,
  points: number,
) => {
  if (points <= 0) return 0;
  const discount = await loyaltyService.create({
    userId,
    points: -points,
    action: LOYALTY_ACTION.REDEEM,
    description: `Đổi ${points} điểm cho đơn #${bookingId.slice(-8).toUpperCase()}`,
    bookingId,
  });
  return discount;
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
