import type { BookingStatus, PaymentMethod } from '@shared/constants/statuses';
import type { SeatType } from '@shared/constants/seat-types';

export interface BookingItem {
  seatId: string;
  row: string;
  col: number;
  seatType: SeatType;
  price: number;
}

export interface FoodOrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface IBooking {
  _id: string;
  userId: string;
  showtimeId: string | IShowtime;
  items: BookingItem[];
  foodOrders: FoodOrderItem[];
  totalAmount: number;
  status: BookingStatus;
  paymentMethod?: PaymentMethod;
  bookingCode: string;
  seatHoldExpiry: string;
  phoneNumber?: string;
  email?: string;
  createdAt: string;
}

export interface IShowtime {
  _id: string;
  movieId: string | IMovie;
  roomId: string | IRoom;
  startTime: string;
  ticketPrice: number;
  status: string;
}

export interface IMovie {
  _id: string;
  title: string;
  duration: number;
  poster?: string;
}

export interface IRoom {
  _id: string;
  name: string;
  type: string;
}

export interface CreateBookingInput {
  showtimeId: string;
  seats: string[];
  foodItems?: {
    productId: string;
    quantity: number;
  }[];
  phoneNumber?: string;
  email?: string;
}

export interface ConfirmBookingInput {
  paymentMethod: PaymentMethod;
}
