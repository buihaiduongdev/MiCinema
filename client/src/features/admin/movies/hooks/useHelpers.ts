import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../../lib/api-client';

interface Genre {
  _id: string;
  name: string;
  slug: string;
}

interface Person {
  _id: string;
  name: string;
  avatar?: string;
  bio?: string;
  roles: string[];
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
 * Hook: Lấy danh sách thể loại phim
 */
export const useGenres = () => {
  return useQuery({
    queryKey: ['genres'],
    queryFn: async () => {
      const result = await apiClient.get('/genres');
      const genres = (result as ApiResponse<Genre[]>).data;
      return Array.isArray(genres) ? genres : [];
    },
  });
};

/**
 * Hook: Lấy danh sách đạo diễn
 */
export const useDirectors = () => {
  return useQuery({
    queryKey: ['persons', 'directors'],
    queryFn: async () => {
      const result = await apiClient.get('/persons', {
        params: { limit: 100, role: 'DIRECTOR' },
      });

      const apiResponse = result as ApiResponse<PaginatedResponse<Person>>;

      if (apiResponse.data && Array.isArray(apiResponse.data.data)) {
        return apiResponse.data.data;
      }
      if (Array.isArray(apiResponse.data)) {
        return apiResponse.data as unknown as Person[];
      }
      return [];
    },
  });
};

/**
 * Hook: Lấy danh sách diễn viên
 */
export const useActors = () => {
  return useQuery({
    queryKey: ['persons', 'actors'],
    queryFn: async () => {
      const result = await apiClient.get('/persons', {
        params: { limit: 100, role: 'ACTOR' },
      });

      const apiResponse = result as ApiResponse<PaginatedResponse<Person>>;

      if (apiResponse.data && Array.isArray(apiResponse.data.data)) {
        return apiResponse.data.data;
      }
      if (Array.isArray(apiResponse.data)) {
        return apiResponse.data as unknown as Person[];
      }
      return [];
    },
  });
};

/**
 * Hook: Lấy tất cả persons (legacy - dùng cho backward compatibility)
 */
export const usePersons = () => {
  return useQuery({
    queryKey: ['persons', 'all'],
    queryFn: async () => {
      const result = await apiClient.get('/persons', {
        params: { limit: 100 },
      });

      const apiResponse = result as ApiResponse<PaginatedResponse<Person>>;

      if (apiResponse.data && Array.isArray(apiResponse.data.data)) {
        return apiResponse.data.data;
      }
      if (Array.isArray(apiResponse.data)) {
        return apiResponse.data as unknown as Person[];
      }
      return [];
    },
  });
};

export type { Genre, Person };
