import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId;
  movieId: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    movieId: {
      type: Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    comment: {
      type: String,
      maxlength: 1000,
      default: '',
    },
  },
  { timestamps: true },
);

// Mỗi user chỉ được review 1 lần cho 1 phim
reviewSchema.index({ userId: 1, movieId: 1 }, { unique: true });
// Truy vấn nhanh theo phim
reviewSchema.index({ movieId: 1, createdAt: -1 });

export const Review = mongoose.model<IReview>('Review', reviewSchema);
