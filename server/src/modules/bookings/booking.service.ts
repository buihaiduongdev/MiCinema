import { Booking } from '../../models/Booking.model.js';
import { Showtime } from '../../models/Showtime.model.js';
import { CreateBooking } from '@shared/schemas/booking.schema.js';
import { BOOKING_STATUS } from '@shared/constants/statuses.js';
import { getSkip, getPaginationData } from '../../utils/pagination.js';

export const getAllByUser = async (userId: string, page = 1, limit = 10) => {
  const skip = getSkip(page, limit);
  const [bookings, totalItems] = await Promise.all([
    Booking.find({ userId })
      .populate('showtimeId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Booking.countDocuments({ userId }),
  ]);
  const meta = getPaginationData(totalItems, page, limit);
  return { bookings, meta };
};

export const getById = async (id: string) => {
  return Booking.findById(id).populate({
    path: 'showtimeId',
    populate: [{ path: 'movieId' }, { path: 'roomId' }],
  });
};

export const getSeatMap = async (showtimeId: string) => {
  const showtime = await Showtime.findById(showtimeId).populate('roomId');
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
