import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../../lib/api-client';
import type { CreatePersonInput } from '@shared/schemas/person.schema';

export const useCreatePerson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePersonInput) => {
      const response = await apiClient.post('/persons', data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-persons'] });
      queryClient.invalidateQueries({ queryKey: ['persons'] });
    },
  });
};
