import mongoose, { Schema, Document } from 'mongoose';

export interface IGenre extends Document {
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const genreSchema = new Schema<IGenre>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Genre = mongoose.model<IGenre>('Genre', genreSchema);
