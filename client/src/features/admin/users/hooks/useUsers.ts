import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../../lib/api-client';
import type { ApiResponse, PaginatedResponse } from '@shared/types/api.type';
import type { User } from '@shared/schemas/user.schema';

interface GetUsersOptions {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
}

interface CreateUserData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role: string;
}

/**
 * Hook: Lấy danh sách user với filter, search, pagination
 */
export const useUsers = (options?: GetUsersOptions) => {
  return useQuery({
    queryKey: ['users', options],
    queryFn: async () => {
      const response = await apiClient.get<
        ApiResponse<PaginatedResponse<User>>
      >('/users', { params: options });
      return response; // Trả về ApiResponse chứa PaginatedResponse
    },
  });
};

/**
 * Hook: Lấy thông tin user by id
 */
export const useUserById = (id?: string) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

/**
 * Hook: Tạo user mới (nhân viên)
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUserData) => {
      const response = await apiClient.post<ApiResponse<User>>('/users', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

/**
 * Hook: Cập nhật user
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<User> }) => {
      const response = await apiClient.put<ApiResponse<User>>(
        `/users/${id}`,
        data,
      );
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', id] });
    },
  });
};

/**
 * Hook: Khoá user account
 */
export const useLockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch<ApiResponse<User>>(
        `/users/${id}/lock`,
      );
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', id] });
    },
  });
};

/**
 * Hook: Mở khoá user account
 */
export const useUnlockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch<ApiResponse<User>>(
        `/users/${id}/unlock`,
      );
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', id] });
    },
  });
};

/**
 * Hook: Xoá user
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete<ApiResponse<User>>(
        `/users/${id}`,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
