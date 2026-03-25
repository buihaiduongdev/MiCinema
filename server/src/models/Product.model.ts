import mongoose, { Schema, Document, Types } from 'mongoose';

export enum ProductCategory {
  FOOD = 'FOOD',
  DRINK = 'DRINK',
  COMBO = 'COMBO',
  OTHER = 'OTHER',
}

export interface IComboItem {
  productId: Types.ObjectId;
  quantity: number;
}

export interface IProduct extends Document {
  name: string;
  price: number;
  image?: string;
  category: ProductCategory;
  description?: string;
  isActive: boolean;
  comboItems?: IComboItem[];
  discount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ComboItemSchema = new Schema<IComboItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
    },
    category: {
      type: String,
      enum: Object.values(ProductCategory),
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    comboItems: [ComboItemSchema],
    discount: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ name: 1 });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
