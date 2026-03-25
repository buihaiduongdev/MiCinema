import mongoose, { Schema, Document } from 'mongoose';
import type { MovieStatus } from '@shared/constants/statuses';

export interface IMovie extends Document {
  title: string;
  duration: number;
  genre: string[];
  director: string;
  cast: string[];
  releaseDate: Date;
  endDate?: Date;
  poster?: string;
  trailer?: string;
  rating: number;
  status: MovieStatus;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const movieSchema = new Schema<IMovie>(
  {
    title: { type: String, required: true },
    duration: { type: Number, required: true },
    genre: { type: [String], default: [] },
    director: { type: String, required: true },
    cast: { type: [String], default: [] },
    releaseDate: { type: Date, required: true },
    endDate: { type: Date },
    poster: { type: String },
    trailer: { type: String },
    rating: { type: Number, default: 0, min: 0, max: 10 },
    status: {
      type: String,
      enum: ['UPCOMING', 'RELEASED', 'ENDED'],
      default: 'UPCOMING',
    },
    description: { type: String },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    collection: 'movies',
  }
);

movieSchema.index({ title: 1 });
movieSchema.index({ status: 1 });
movieSchema.index({ releaseDate: -1 });

export const Movie = mongoose.model<IMovie>('Movie', movieSchema);
