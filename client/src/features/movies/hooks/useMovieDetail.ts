/**
 * useMovieDetail — Hooks cho trang chi tiết phim
 *
 * Tách riêng khỏi useMovies vì dùng ở MovieDetailPage
 * Bao gồm: useMovieBySlug, useMovieById, useRelatedMovies, useShowtimesByMovie
 */

import { useQuery } from '@tanstack/react-query';
import {
  getMovieBySlug,
  getMovieById,
  getRelatedMovies,
} from '../services/movies.service';
import apiClient from '../../../lib/api-client';

/**
 * Lấy chi tiết phim theo slug (cho URL SEO-friendly)
 */
export const useMovieBySlug = (slug: string) =>
  useQuery({
    queryKey: ['movies', 'slug', slug],
    queryFn: () => getMovieBySlug(slug),
    staleTime: 5 * 60 * 1000,
    enabled: !!slug,
  });

/**
 * Lấy chi tiết phim theo ID
 */
export const useMovieById = (id: string) =>
  useQuery({
    queryKey: ['movies', 'detail', id],
    queryFn: () => getMovieById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });

/**
 * Lấy phim liên quan (cùng thể loại)
 */
export const useRelatedMovies = (movieId: string, limit = 6) =>
  useQuery({
    queryKey: ['movies', 'related', movieId, limit],
    queryFn: () => getRelatedMovies(movieId, limit),
    staleTime: 5 * 60 * 1000,
    enabled: !!movieId,
  });

/**
 * Lấy suất chiếu theo phim (grouped by date)
 */
export const useShowtimesByMovie = (movieId: string, cinemaId?: string) =>
  useQuery({
    queryKey: ['showtimes', 'movie', movieId, cinemaId],
    queryFn: () =>
      apiClient.get(`/showtimes/movie/${movieId}`, {
        params: cinemaId ? { cinemaId } : {},
      }),
    staleTime: 2 * 60 * 1000,
    enabled: !!movieId,
  });
