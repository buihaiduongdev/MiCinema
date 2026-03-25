import mongoose, { Schema, Document, Types } from 'mongoose';
import {
  BOOKING_STATUS,
  BookingStatus,
  PAYMENT_METHOD,
  PaymentMethod,
} from '@shared/constants/statuses';
import { SeatType, SEAT_TYPE } from '@shared/constants/seat-types';

export interface IBookingItem {
  seatId: string;
  row: string;
  col: number;
  seatType: SeatType;
  price: number;
}

export interface IFoodOrderItem {
  productId: Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
}

export interface IBooking extends Document {
  userId: Types.ObjectId;
  showtimeId: Types.ObjectId;
  items: IBookingItem[];
  foodOrders: IFoodOrderItem[];
  totalAmount: number;
  status: BookingStatus;
  paymentMethod?: PaymentMethod;
  bookingCode: string;
  seatHoldExpiry: Date;
  phoneNumber?: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingItemSchema = new Schema<IBookingItem>({
  seatId: { type: String, required: true },
  row: { type: String, required: true },
  col: { type: Number, required: true },
  seatType: {
    type: String,
    enum: Object.values(SEAT_TYPE),
    required: true,
  },
  price: { type: Number, required: true, min: 0 },
});

const FoodOrderItemSchema = new Schema<IFoodOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
});

const BookingSchema = new Schema<IBooking>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    showtimeId: {
      type: Schema.Types.ObjectId,
      ref: 'Showtime',
      required: true,
    },
    items: {
      type: [BookingItemSchema],
      required: true,
      validate: {
        validator: (v: IBookingItem[]) => v.length > 0,
        message: 'Phải có ít nhất 1 ghế',
      },
    },
    foodOrders: [FoodOrderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.PENDING,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PAYMENT_METHOD),
    },
    bookingCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    seatHoldExpiry: {
      type: Date,
      required: true,
    },
    phoneNumber: {
      type: String,
      match: /^0\d{9}$/,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

BookingSchema.index({ userId: 1, createdAt: -1 });
BookingSchema.index({ showtimeId: 1 });
BookingSchema.index({ seatHoldExpiry: 1, status: 1 });
BookingSchema.index({ bookingCode: 1 });

export const Booking = mongoose.model<IBooking>('Booking', BookingSchema);
