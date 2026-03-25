import {
  Booking,
  IBooking,
  IBookingItem,
  IFoodOrderItem,
} from '@/models/Booking.model';
import { Showtime } from '@/models/Showtime.model';
import { CinemaRoom } from '@/models/CinemaRoom.model';
import { Product } from '@/models/Product.model';
import { showtimeService } from '../showtimes/showtime.service';
import {
  BOOKING_STATUS,
  SEAT_STATUS,
  PaymentMethod,
} from '@shared/constants/statuses';
import { PRICE_MULTIPLIER } from '@shared/constants/seat-types';
import { Types } from 'mongoose';

export interface CreateBookingInput {
  userId: string;
  showtimeId: string;
  seats: string[];
  foodItems?: { productId: string; quantity: number }[];
  phoneNumber?: string;
  email?: string;
}

export interface ConfirmBookingInput {
  bookingId: string;
  paymentMethod: PaymentMethod;
}

export class BookingService {
  async create(input: CreateBookingInput): Promise<IBooking> {
    const showtime = await Showtime.findById(input.showtimeId).populate(
      'roomId'
    );
    if (!showtime) {
      throw new Error('Suất chiếu không tồn tại');
    }

    const room = await CinemaRoom.findById(showtime.roomId);
    if (!room) {
      throw new Error('Phòng chiếu không tồn tại');
    }

    await showtimeService.holdSeats({
      showtimeId: input.showtimeId,
      seats: input.seats,
      userId: input.userId,
    });

    const bookingItems: IBookingItem[] = [];
    let totalAmount = 0;

    for (const seatId of input.seats) {
      const [row, colStr] = [seatId[0], seatId.slice(1)];
      const col = parseInt(colStr);

      const seat = room.seats.find((s) => s.row === row && s.col === col);
      if (!seat) {
        throw new Error(`Ghế ${seatId} không tồn tại`);
      }

      const price = showtime.ticketPrice * PRICE_MULTIPLIER[seat.type];

      bookingItems.push({
        seatId,
        row,
        col,
        seatType: seat.type,
        price,
      });

      totalAmount += price;
    }

    const foodOrders: IFoodOrderItem[] = [];
    if (input.foodItems && input.foodItems.length > 0) {
      for (const item of input.foodItems) {
        const product = await Product.findById(item.productId);
        if (!product || !product.isActive) {
          throw new Error(`Sản phẩm không tồn tại hoặc không khả dụng`);
        }

        const itemTotal = product.price * item.quantity;
        foodOrders.push({
          productId: new Types.ObjectId(item.productId),
          name: product.name,
          quantity: item.quantity,
          price: itemTotal,
        });

        totalAmount += itemTotal;
      }
    }

    const bookingCode = this.generateBookingCode();
    const seatHoldExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const booking = new Booking({
      userId: new Types.ObjectId(input.userId),
      showtimeId: new Types.ObjectId(input.showtimeId),
      items: bookingItems,
      foodOrders,
      totalAmount,
      bookingCode,
      seatHoldExpiry,
      phoneNumber: input.phoneNumber,
      email: input.email,
      status: BOOKING_STATUS.PENDING,
    });

    return await booking.save();
  }

  async getById(id: string): Promise<IBooking | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID không hợp lệ');
    }

    return await Booking.findById(id)
      .populate('userId', 'name email phone')
      .populate({
        path: 'showtimeId',
        populate: [
          { path: 'movieId', select: 'title duration poster' },
          { path: 'roomId', select: 'name type' },
        ],
      });
  }

  async confirm(input: ConfirmBookingInput): Promise<IBooking> {
    const booking = await Booking.findById(input.bookingId);
    if (!booking) {
      throw new Error('Đơn đặt vé không tồn tại');
    }

    if (booking.status !== BOOKING_STATUS.PENDING) {
      throw new Error('Đơn đặt vé không ở trạng thái chờ thanh toán');
    }

    if (new Date() > booking.seatHoldExpiry) {
      booking.status = BOOKING_STATUS.CANCELLED;
      await booking.save();

      await showtimeService.releaseSeats(
        booking.showtimeId.toString(),
        booking.items.map((i) => i.seatId)
      );

      throw new Error('Đơn đặt vé đã hết hạn giữ chỗ');
    }

    booking.status = BOOKING_STATUS.PAID;
    booking.paymentMethod = input.paymentMethod;
    await booking.save();

    await showtimeService.bookSeats(
      booking.showtimeId.toString(),
      booking.items.map((i) => i.seatId),
      booking._id as Types.ObjectId
    );

    return booking;
  }

  async cancel(bookingId: string): Promise<IBooking> {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error('Đơn đặt vé không tồn tại');
    }

    if (booking.status === BOOKING_STATUS.CANCELLED) {
      throw new Error('Đơn đặt vé đã bị hủy');
    }

    booking.status = BOOKING_STATUS.CANCELLED;
    await booking.save();

    await showtimeService.releaseSeats(
      booking.showtimeId.toString(),
      booking.items.map((i) => i.seatId)
    );

    return booking;
  }

  async getUserBookings(
    userId: string,
    options: { page?: number; limit?: number } = {}
  ) {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      Booking.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: 'showtimeId',
          populate: [
            { path: 'movieId', select: 'title poster duration' },
            { path: 'roomId', select: 'name' },
          ],
        }),
      Booking.countDocuments({ userId }),
    ]);

    return {
      bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async releaseExpiredBookings(): Promise<number> {
    const now = new Date();
    const expiredBookings = await Booking.find({
      status: BOOKING_STATUS.PENDING,
      seatHoldExpiry: { $lt: now },
    });

    for (const booking of expiredBookings) {
      booking.status = BOOKING_STATUS.CANCELLED;
      await booking.save();

      await showtimeService.releaseSeats(
        booking.showtimeId.toString(),
        booking.items.map((i) => i.seatId)
      );
    }

    return expiredBookings.length;
  }

  private generateBookingCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'BC';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}

export const bookingService = new BookingService();
