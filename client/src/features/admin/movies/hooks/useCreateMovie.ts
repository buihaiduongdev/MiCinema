import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../../lib/api-client';
import type { ApiResponse } from '@shared/types/api.type';
import type { CreateMovieInput } from '@shared/schemas/movie.schema';
import type { Movie } from './useMovies';

/**
 * Hook: Tạo phim mới
 */
export const useCreateMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMovieInput) => {
      const response = await apiClient.post<ApiResponse<Movie>>(
        '/movies',
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-movies'] });
    },
  });
};
