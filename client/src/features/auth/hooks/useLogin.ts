import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { loginApi } from '../services/auth.service';
import type { ApiResponse, LoginInput } from '@shared/index';

export function useLogin() {
  const queryClient = useQueryClient();

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
