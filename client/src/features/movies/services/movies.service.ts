/**
 * Movies Service — API calls cho module phim
 *
 * Dùng: apiClient (đã auto attach token)
 * Trả về: data đã unwrap từ interceptor (response.data)
 */

import apiClient from '../../../lib/api-client';

export interface MovieResponse {
  _id: string;
  title: string;
  slug: string;
  description: string;
  directors: {
    _id: string;
    name: string;
    avatar?: string;
    nationality?: string;
  }[];
  actors: {
    _id: string;
    name: string;
    avatar?: string;
    nationality?: string;
  }[];
  genres: { _id: string; name: string; slug: string }[];
  duration: number;
  releaseDate: string;
  endDate?: string;
  poster: string;
  trailer?: string;
  rating: number;
  status: string;
  language: string;
  audioType: string;
  ageRating: string;
  country?: string;
  viewCount: number;
  createdAt: string;
}

export interface CinemaResponse {
  _id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  phone?: string;
  email?: string;
  description?: string;
  images: string[];
  openingHours?: string;
}

export interface MoviesListResponse {
  success: boolean;
  data: {
    data: MovieResponse[];
    pagination: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      itemsPerPage: number;
    };
  };
}

// --- MOVIES API ---

export const getMovies = (params?: Record<string, any>) =>
  apiClient.get('/movies', { params });

export const getNowShowing = (limit = 10) =>
  apiClient.get('/movies/now-showing', { params: { limit } });

export const getUpcoming = (limit = 10) =>
  apiClient.get('/movies/upcoming', { params: { limit } });

export const getMovieBySlug = (slug: string) =>
  apiClient.get(`/movies/slug/${slug}`);

export const getMovieById = (id: string) => apiClient.get(`/movies/${id}`);

export const getRelatedMovies = (movieId: string, limit = 6) =>
  apiClient.get(`/movies/${movieId}/related`, { params: { limit } });

// --- CINEMAS API ---

export const getCinemas = (params?: Record<string, any>) =>
  apiClient.get('/cinemas', { params });

export const getCinemaCities = () => apiClient.get('/cinemas/cities');

// --- GENRES API ---

export const getGenres = () => apiClient.get('/genres');
