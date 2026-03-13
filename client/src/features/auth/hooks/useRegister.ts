/**
 * useRegister — Custom Hook cho đăng ký
 *
 * Dùng: useMutation từ TanStack Query
 * mutationFn: POST /api/auth/register → { user, token }
 * onSuccess: tự động login sau khi đăng ký thành công
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { registerApi } from '../services/auth.service';
import type { ApiResponse, RegisterInput } from '@shared/index';

export function useRegister() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterInput) => registerApi(data),
    onSuccess: (res) => {
      localStorage.setItem('accessToken', res.data.token);
      queryClient.invalidateQueries({ queryKey: ['me'] });
      notifications.show({
        title: 'Thành công',
        message: 'Đăng ký thành công',
        color: 'green',
      });
      navigate('/');
    },
    onError: (error: ApiResponse<null>) => {
      notifications.show({
        title: 'Thất bại',
        message: error.message || 'Đăng ký thất bại',
        color: 'red',
      });
    },
  });
}
