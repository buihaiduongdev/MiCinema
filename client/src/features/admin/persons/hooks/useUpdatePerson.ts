import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../../lib/api-client';
import type { UpdatePersonInput } from '@shared/schemas/person.schema';

interface UpdatePersonParams {
  id: string;
  data: UpdatePersonInput;
}

export const useUpdatePerson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: UpdatePersonParams) => {
      const response = await apiClient.put(`/persons/${id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-persons'] });
      queryClient.invalidateQueries({ queryKey: ['persons'] });
    },
  });
};
