import mongoose, { Schema, Document } from 'mongoose';
import { PERSON_ROLE } from '@shared/constants/person-roles';
import type { PersonRole } from '@shared/constants/person-roles';

export interface IPerson extends Document {
  name: string;
  slug: string; // URL thân thiện
  avatar?: string;
  images: string[]; // Gallery hình ảnh
  nationality?: string;
  biography?: string;
  birthDate?: Date;
  height?: number; // Chiều cao (cm)
  viewCount: number; // Lượt xem
  roles: PersonRole[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const personSchema = new Schema<IPerson>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    avatar: { type: String },
    images: [{ type: String }],
    nationality: { type: String, trim: true },
    biography: { type: String },
    birthDate: { type: Date },
    height: { type: Number },
    viewCount: { type: Number, default: 0 },
    roles: [
      {
        type: String,
        enum: Object.values(PERSON_ROLE),
        required: true,
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Full-text search theo tên
personSchema.index({ name: 'text' });
// Lọc theo vai trò (ACTOR / DIRECTOR)
personSchema.index({ roles: 1 });

export const Person = mongoose.model<IPerson>('Person', personSchema);
