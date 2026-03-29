import mongoose, { Document, Schema } from 'mongoose';
import { FOOD_ORDER_STATUS } from '@shared/constants/statuses';

export interface IFoodOrderItem {
  productId: mongoose.Types.ObjectId;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface IFoodOrder extends Document {
  userId: mongoose.Types.ObjectId;
  /** Suất chiếu — dùng để nhóm/lọc đơn (UC-49) */
  showtimeId: mongoose.Types.ObjectId;
  bookingId?: mongoose.Types.ObjectId | null;
  items: IFoodOrderItem[];
  totalAmount: number;
  status: (typeof FOOD_ORDER_STATUS)[keyof typeof FOOD_ORDER_STATUS];
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IFoodOrderItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    productName: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const foodOrderSchema = new Schema<IFoodOrder>(
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
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      default: null,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (v: IFoodOrderItem[]) => Array.isArray(v) && v.length > 0,
        message: 'Đơn cần ít nhất một dòng hàng',
      },
    },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: Object.values(FOOD_ORDER_STATUS),
      default: FOOD_ORDER_STATUS.PENDING,
    },
  },
  { timestamps: true },
);

foodOrderSchema.index({ showtimeId: 1, createdAt: -1 });
foodOrderSchema.index({ userId: 1, createdAt: -1 });
foodOrderSchema.index({ bookingId: 1 });

export const FoodOrder = mongoose.model<IFoodOrder>(
  'FoodOrder',
  foodOrderSchema,
);
