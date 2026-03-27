import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../../lib/api-client';
import type { ApiResponse } from '@shared/types/api.type';
import type { UpdateMovieInput } from '@shared/schemas/movie.schema';
import type { Movie } from './useMovies';

/**
 * Hook: Cập nhật phim
 */
export const useUpdateMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateMovieInput;
    }) => {
      const response = await apiClient.put<ApiResponse<Movie>>(
        `/movies/${id}`,
        data,
      );
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-movies'] });
      queryClient.invalidateQueries({ queryKey: ['admin-movies', id] });
    },
  });
};
