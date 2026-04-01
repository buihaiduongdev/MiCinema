import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../../lib/api-client';
import type { PersonFilter } from '@shared/schemas/person.schema';

export interface Person {
  _id: string;
  name: string;
  slug: string;
  avatar?: string;
  images: string[];
  nationality?: string;
  biography?: string;
  birthDate?: string;
  height?: number;
  viewCount: number;
  roles: ('ACTOR' | 'DIRECTOR')[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Hook: Lấy danh sách persons với filter, search, pagination
 */
export const usePersons = (options?: Partial<PersonFilter>) => {
  return useQuery({
    queryKey: ['admin-persons', options],
    queryFn: async () => {
<<<<<<< HEAD
      const response = await apiClient.get<ApiResponse<PaginatedResponse<Person>>>('/persons', {
=======
      const response = await apiClient.get<
        ApiResponse<PaginatedResponse<Person>>
      >('/persons', {
>>>>>>> main
        params: options,
      });
      return response;
    },
  });
};

/**
 * Hook: Lấy thông tin person by id
 */
export const usePersonById = (id?: string) => {
  return useQuery({
    queryKey: ['admin-persons', id],
    queryFn: async () => {
      if (!id) return null;
<<<<<<< HEAD
      const response = await apiClient.get<ApiResponse<Person>>(`/persons/${id}`);
=======
      const response = await apiClient.get<ApiResponse<Person>>(
        `/persons/${id}`,
      );
>>>>>>> main
      return (response as ApiResponse<Person>).data;
    },
    enabled: !!id,
  });
};
