/**
 * Reviews Service — API calls cho module đánh giá phim
 *
 * Dùng: apiClient (đã auto attach token)
 * Trả về: data đã unwrap từ interceptor (response.data)
 */

import apiClient from '../../../lib/api-client';

export interface ReviewUser {
  _id: string;
  fullName: string;
  avatar?: string;
  email: string;
}

export interface ReviewResponse {
  _id: string;
  userId: ReviewUser;
  movieId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewStats {
  movieId: string;
  avgRating: number;
  totalReviews: number;
  ratingDistribution: Record<
    number,
    { count: number; percentage: number }
  >;
}

// --- REVIEWS API ---

/** Lấy danh sách review theo phim */
export const getReviewsByMovie = (
  movieId: string,
  params?: Record<string, any>,
) => apiClient.get(`/reviews/movie/${movieId}`, { params });

/** Lấy thống kê rating của phim */
export const getMovieRatingStats = (movieId: string) =>
  apiClient.get(`/reviews/movie/${movieId}/stats`);

/** Lấy review của user hiện tại cho phim */
export const getMyReviewForMovie = (movieId: string) =>
  apiClient.get(`/reviews/movie/${movieId}/my`);

/** Lấy lịch sử review của user */
export const getMyReviews = (params?: Record<string, any>) =>
  apiClient.get('/reviews/my', { params });

/** Tạo review mới */
export const createReview = (data: {
  movieId: string;
  rating: number;
  comment?: string;
}) => apiClient.post('/reviews', data);

/** Cập nhật review */
export const updateReview = (
  id: string,
  data: { rating?: number; comment?: string },
) => apiClient.put(`/reviews/${id}`, data);

/** Xóa review */
export const deleteReview = (id: string) =>
  apiClient.delete(`/reviews/${id}`);
