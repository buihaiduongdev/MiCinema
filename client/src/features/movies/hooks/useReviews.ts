/**
 * useReviews — Hooks cho đánh giá phim
 *
 * Dùng: useQuery, useMutation từ TanStack Query
 * Bao gồm: useReviewsByMovie, useMovieRatingStats, useMyReviewForMovie,
 *           useCreateReview, useUpdateReview, useDeleteReview
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getReviewsByMovie,
  getMovieRatingStats,
  getMyReviewForMovie,
  createReview,
  updateReview,
  deleteReview,
} from '../services/reviews.service';

/**
 * Lấy danh sách review theo phim (có phân trang)
 */
export const useReviewsByMovie = (
  movieId: string,
  params?: Record<string, any>,
) =>
  useQuery({
    queryKey: ['reviews', 'movie', movieId, params],
    queryFn: () => getReviewsByMovie(movieId, params),
    staleTime: 2 * 60 * 1000,
    enabled: !!movieId,
  });

/**
 * Lấy thống kê rating của phim (phân bố sao, tổng review)
 */
export const useMovieRatingStats = (movieId: string) =>
  useQuery({
    queryKey: ['reviews', 'stats', movieId],
    queryFn: () => getMovieRatingStats(movieId),
    staleTime: 2 * 60 * 1000,
    enabled: !!movieId,
  });

/**
 * Lấy review của user hiện tại cho phim (kiểm tra đã review chưa)
 */
export const useMyReviewForMovie = (movieId: string, enabled = true) =>
  useQuery({
    queryKey: ['reviews', 'my', movieId],
    queryFn: () => getMyReviewForMovie(movieId),
    staleTime: 5 * 60 * 1000,
    enabled: !!movieId && enabled,
  });

/**
 * Tạo review mới
 */
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { movieId: string; rating: number; comment?: string }) =>
      createReview(data),
    onSuccess: (_data, variables) => {
      // Invalidate tất cả queries liên quan review của phim này
      queryClient.invalidateQueries({
        queryKey: ['reviews', 'movie', variables.movieId],
      });
      queryClient.invalidateQueries({
        queryKey: ['reviews', 'stats', variables.movieId],
      });
      queryClient.invalidateQueries({
        queryKey: ['reviews', 'my', variables.movieId],
      });
      // Invalidate movie detail (vì rating đã thay đổi)
      queryClient.invalidateQueries({ queryKey: ['movies'] });
    },
  });
};

/**
 * Cập nhật review
 */
export const useUpdateReview = (movieId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { rating?: number; comment?: string };
    }) => updateReview(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['reviews', 'movie', movieId],
      });
      queryClient.invalidateQueries({
        queryKey: ['reviews', 'stats', movieId],
      });
      queryClient.invalidateQueries({
        queryKey: ['reviews', 'my', movieId],
      });
      queryClient.invalidateQueries({ queryKey: ['movies'] });
    },
  });
};

/**
 * Xóa review
 */
export const useDeleteReview = (movieId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['reviews', 'movie', movieId],
      });
      queryClient.invalidateQueries({
        queryKey: ['reviews', 'stats', movieId],
      });
      queryClient.invalidateQueries({
        queryKey: ['reviews', 'my', movieId],
      });
      queryClient.invalidateQueries({ queryKey: ['movies'] });
    },
  });
};
