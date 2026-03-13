/**
 * useLogin — Custom Hook cho đăng nhập
 *
 * Dùng: useMutation từ TanStack Query
 * mutationFn: POST /api/auth/login → { user, token }
 * onSuccess: dispatch LOGIN_SUCCESS lên AuthProvider, redirect về /
 * onError: hiển thị notification lỗi
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { loginApi } from '../services/auth.service';
import type { ApiResponse, LoginInput } from '@shared/index';

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginInput) => loginApi(data),
    onSuccess: (res) => {
      localStorage.setItem('accessToken', res.data.token);

      queryClient.invalidateQueries({ queryKey: ['me'] });
      notifications.show({
        title: 'Thành công',
        message: res.message,
        color: 'green',
      });
      navigate('/');
    },
    onError: (error: ApiResponse<null>) => {
      notifications.show({
        title: 'Thất bại',
        message: error.message || 'Có lỗi hệ thống',
        color: 'red',
      });
    },
  });
}
