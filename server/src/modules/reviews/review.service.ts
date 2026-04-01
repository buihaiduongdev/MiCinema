/**
 * Reviews Service — Business logic
 *
 * Dùng: Mongoose models từ models/
 * Tách business logic ra khỏi controller
 * Export các function: create, getByMovie, getByUser, update, remove, getMovieRatingStats
 * Xử lý: pagination (utils/pagination), error throwing, cập nhật rating trung bình trên Movie
 */

import mongoose from 'mongoose';
import { Review } from '../../models/Review.model.js';
import { Movie } from '../../models/Movie.model.js';
import { User } from '../../models/User.model.js';
import { getSkip, getPaginationData } from '../../utils/pagination.js';
import type {
  CreateReviewInput,
  UpdateReviewInput,
  ReviewFilter,
} from '@shared/schemas/review.schema';

// Populate fields dùng chung
const POPULATE_FIELDS = [
  { path: 'userId', select: 'fullName avatar email' },
];

/**
 * Tính lại rating trung bình của phim sau khi thêm/sửa/xóa review
 * Cập nhật trực tiếp field rating trên Movie document
 */
const recalculateMovieRating = async (movieId: string) => {
  const result = await Review.aggregate([
    { $match: { movieId: new mongoose.Types.ObjectId(movieId) } },
    {
      $group: {
        _id: '$movieId',
        avgRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  const avgRating = result.length > 0 ? Math.round(result[0].avgRating * 10) / 10 : 0;

  await Movie.findByIdAndUpdate(movieId, { rating: avgRating });

  return { avgRating, totalReviews: result.length > 0 ? result[0].totalReviews : 0 };
};

/**
 * Tạo review mới
 * Mỗi user chỉ được review 1 lần cho 1 phim (unique index)
 */
export const create = async (userId: string, data: CreateReviewInput) => {
  // Validate movie tồn tại
  const movie = await Movie.findById(data.movieId);
  if (!movie) throw new Error('Không tìm thấy phim');

  // Validate user tồn tại
  const user = await User.findById(userId);
  if (!user) throw new Error('Người dùng không tồn tại');

  // Kiểm tra đã review chưa
  const existingReview = await Review.findOne({
    userId,
    movieId: data.movieId,
  });
  if (existingReview) {
    throw new Error('Bạn đã đánh giá phim này rồi. Hãy chỉnh sửa đánh giá hiện tại.');
  }

  const review = await Review.create({
    userId,
    movieId: data.movieId,
    rating: data.rating,
    comment: data.comment || '',
  });

  // Cập nhật rating trung bình của phim
  await recalculateMovieRating(data.movieId);

  return review.populate(POPULATE_FIELDS);
};

/**
 * Lấy danh sách review theo phim (có phân trang)
 */
export const getByMovie = async (movieId: string, filter: ReviewFilter) => {
  const { page, limit, sortBy, sortOrder } = filter;

  const movie = await Movie.findById(movieId);
  if (!movie) throw new Error('Không tìm thấy phim');

  const query = { movieId };
  const totalItems = await Review.countDocuments(query);
  const skip = getSkip(page, limit);

  const sort: any = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const data = await Review.find(query)
    .populate(POPULATE_FIELDS)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();

  const pagination = getPaginationData(totalItems, page, limit);

  return { data, pagination };
};

/**
 * Lấy review của user cho 1 phim cụ thể (kiểm tra đã review chưa)
 */
export const getUserReviewForMovie = async (userId: string, movieId: string) => {
  const review = await Review.findOne({ userId, movieId })
    .populate(POPULATE_FIELDS)
    .lean();
  return review;
};

/**
 * Lấy tất cả review của 1 user (lịch sử đánh giá)
 */
export const getByUser = async (userId: string, filter: ReviewFilter) => {
  const { page, limit, sortBy, sortOrder } = filter;

  const query = { userId };
  const totalItems = await Review.countDocuments(query);
  const skip = getSkip(page, limit);

  const sort: any = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const data = await Review.find(query)
    .populate([
      ...POPULATE_FIELDS,
      { path: 'movieId', select: 'title slug poster rating' },
    ])
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();

  const pagination = getPaginationData(totalItems, page, limit);

  return { data, pagination };
};

/**
 * Cập nhật review (chỉ owner được sửa)
 */
export const update = async (reviewId: string, userId: string, data: UpdateReviewInput) => {
  const review = await Review.findById(reviewId);
  if (!review) throw new Error('Không tìm thấy đánh giá');

  // Chỉ owner mới được sửa
  if (review.userId.toString() !== userId) {
    throw new Error('Bạn không có quyền chỉnh sửa đánh giá này');
  }

  const updateData: any = {};
  if (data.rating !== undefined) updateData.rating = data.rating;
  if (data.comment !== undefined) updateData.comment = data.comment;

  const updated = await Review.findByIdAndUpdate(reviewId, updateData, {
    new: true,
    runValidators: true,
  }).populate(POPULATE_FIELDS);

  if (!updated) throw new Error('Cập nhật đánh giá thất bại');

  // Cập nhật rating trung bình của phim
  await recalculateMovieRating(review.movieId.toString());

  return updated;
};

/**
 * Xóa review (owner hoặc admin)
 */
export const remove = async (reviewId: string, userId: string, userRole: string) => {
  const review = await Review.findById(reviewId);
  if (!review) throw new Error('Không tìm thấy đánh giá');

  // Chỉ owner hoặc admin mới được xóa
  if (review.userId.toString() !== userId && userRole !== 'ADMIN') {
    throw new Error('Bạn không có quyền xóa đánh giá này');
  }

  const movieId = review.movieId.toString();
  await Review.findByIdAndDelete(reviewId);

  // Cập nhật rating trung bình của phim
  await recalculateMovieRating(movieId);

  return review;
};

/**
 * Lấy thống kê rating của phim (phân bố sao, tổng số review)
 */
export const getMovieRatingStats = async (movieId: string) => {
  const movie = await Movie.findById(movieId);
  if (!movie) throw new Error('Không tìm thấy phim');

  // Phân bố rating: đếm số lượng mỗi mức sao (1-10, nhóm thành 1-5 sao)
  const distribution = await Review.aggregate([
    { $match: { movieId: new mongoose.Types.ObjectId(movieId) } },
    {
      $group: {
        _id: { $ceil: { $divide: ['$rating', 2] } }, // Nhóm 1-2→1★, 3-4→2★, 5-6→3★, 7-8→4★, 9-10→5★
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: -1 } },
  ]);

  const totalReviews = distribution.reduce((sum, d) => sum + d.count, 0);

  // Tạo object phân bố: { 5: 75, 4: 15, 3: 5, 2: 3, 1: 2 } (%)
  const ratingDistribution: Record<number, { count: number; percentage: number }> = {};
  for (let i = 1; i <= 5; i++) {
    const found = distribution.find((d) => d._id === i);
    const count = found ? found.count : 0;
    ratingDistribution[i] = {
      count,
      percentage: totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0,
    };
  }

  return {
    movieId,
    avgRating: movie.rating,
    totalReviews,
    ratingDistribution,
  };
};
