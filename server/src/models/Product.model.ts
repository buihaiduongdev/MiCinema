import mongoose, { Document, Schema } from 'mongoose';
import { PRODUCT_CATEGORY } from '@shared/constants/food-constants';

export interface IComboItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
}

export interface IProduct extends Document {
  name: string;
  price: number;
  image: string;
  category: (typeof PRODUCT_CATEGORY)[keyof typeof PRODUCT_CATEGORY];
  description?: string;
  /** Ẩn khỏi menu khi hết hàng / ngừng bán (UC-47) */
  isActive: boolean;
  /**
   * Chỉ dùng khi category = COMBO: thành phần và số lượng (UC-48)
   */
  comboItems?: IComboItem[];
  /**
   * Phần trăm giảm so với tổng giá lẻ các thành phần (0–100), áp dụng cho combo
   */
  discountPercent?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

const comboItemSchema = new Schema<IComboItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: Object.values(PRODUCT_CATEGORY),
      required: true,
    },
    description: { type: String, trim: true, maxlength: 2000, default: '' },
    isActive: { type: Boolean, default: true },
    comboItems: {
      type: [comboItemSchema],
      default: undefined,
    },
    discountPercent: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
  },
  { timestamps: true },
);

productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ name: 'text' });

productSchema.pre('validate', function (next) {
  if (this.category === PRODUCT_CATEGORY.COMBO) {
    if (!this.comboItems?.length) {
      next(new Error('Sản phẩm combo cần ít nhất một dòng comboItems'));
      return;
    }
  } else {
    this.set('comboItems', undefined);
    this.set('discountPercent', null);
  }
  next();
});

export const Product = mongoose.model<IProduct>('Product', productSchema);
