import mongoose, { Schema, Document } from 'mongoose';

export interface ICinema extends Document {
  name: string;
  slug: string;
  address: string;
  city: string;
  phone?: string;
  email?: string;
  description?: string;
  images: string[];
  openingHours?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const cinemaSchema = new Schema<ICinema>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    address: { type: String, required: true },
    city: { type: String, required: true, trim: true },
    phone: { type: String },
    email: { type: String, lowercase: true },
    description: { type: String },
    images: [{ type: String }],
    openingHours: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Lọc theo thành phố
cinemaSchema.index({ city: 1 });
// Text search theo tên + địa chỉ
cinemaSchema.index({ name: 'text', address: 'text' });

export const Cinema = mongoose.model<ICinema>('Cinema', cinemaSchema);
