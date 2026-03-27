import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../../lib/api-client';
import type { ApiResponse } from '@shared/types/api.type';
import type { Movie } from './useMovies';

/**
 * Hook: Xóa phim
 */
export const useDeleteMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete<ApiResponse<Movie>>(
        `/movies/${id}`,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-movies'] });
    },
  });
};
