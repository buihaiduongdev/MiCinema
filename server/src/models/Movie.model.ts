import mongoose, { Schema, Document } from 'mongoose';
import { MOVIE_STATUS } from '@shared/constants/statuses';
import { AGE_RATING, AUDIO_TYPE } from '@shared/constants/movie-constants';

export interface IMovie extends Document {
  title: string;
  slug: string;
  description: string;
  directors: mongoose.Types.ObjectId[];
  actors: mongoose.Types.ObjectId[];
  genres: mongoose.Types.ObjectId[];
  duration: number;
  releaseDate: Date;
  endDate?: Date;
  poster: string;
  trailer?: string;
  rating: number;
  status: string;
  language: string;
  audioType: string;
  ageRating: string;
  country?: string;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const movieSchema = new Schema<IMovie>(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: { type: String, required: true },
    directors: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Person',
        required: true,
      },
    ],
    actors: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Person',
      },
    ],
    genres: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Genre',
        required: true,
      },
    ],
    duration: { type: Number, required: true, min: 1 },
    releaseDate: { type: Date, required: true },
    endDate: { type: Date },
    poster: { type: String, required: true },
    trailer: { type: String },
    rating: { type: Number, default: 0, min: 0, max: 10 },
    status: {
      type: String,
      enum: Object.values(MOVIE_STATUS),
      default: MOVIE_STATUS.UPCOMING,
    },
    language: { type: String, required: true },
    audioType: {
      type: String,
      enum: Object.values(AUDIO_TYPE),
      default: AUDIO_TYPE.SUBTITLED,
    },
    ageRating: {
      type: String,
      enum: Object.values(AGE_RATING),
      default: AGE_RATING.P,
    },
    country: { type: String },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Text search theo title + description
movieSchema.index(
  { title: 'text', description: 'text' },
  { language_override: 'dummyLanguageField' }
);
// Lọc nhanh theo status, genres, releaseDate
movieSchema.index({ 'directors': 1 });
movieSchema.index({ 'genres': 1 });
movieSchema.index({ status: 1 });

export const Movie = mongoose.model<IMovie>('Movie', movieSchema);
