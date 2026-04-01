import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../../lib/api-client';
import type { ApiResponse, PaginatedResponse } from '@shared/types/api.type';
import type { MovieFilter } from '@shared/schemas/movie.schema';

interface Movie {
  _id: string;
  title: string;
  slug: string;
  description: string;
  directors: Array<{ _id: string; name: string; avatar?: string }>;
  actors: Array<{ _id: string; name: string; avatar?: string }>;
  genres: Array<{ _id: string; name: string }>;
  duration: number;
  releaseDate: string;
  endDate?: string;
  poster: string;
  trailer?: string;
  rating: number;
  status: 'UPCOMING' | 'RELEASED' | 'ENDED';
  language: string;
  audioType: 'SUBTITLED' | 'DUBBED';
  ageRating: 'P' | 'C13' | 'C16' | 'C18';
  country?: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Hook: Lấy danh sách phim với filter, search, pagination
 */
export const useMovies = (options?: Partial<MovieFilter>) => {
  return useQuery({
    queryKey: ['admin-movies', options],
    queryFn: async () => {
      const response = await apiClient.get<
        ApiResponse<PaginatedResponse<Movie>>
      >('/movies', { params: options });
      return response;
    },
  });
};

/**
 * Hook: Lấy thông tin phim by id
 */
export const useMovieById = (id?: string) => {
  return useQuery({
    queryKey: ['admin-movies', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await apiClient.get<ApiResponse<Movie>>(`/movies/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export type { Movie };
