import { useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { createPaymentApi } from '../services/booking.service';
import type { ApiResponse } from '@shared/index';
export const usePayment = () => {
  return useMutation({
    mutationFn: (bookingId: string) => createPaymentApi(bookingId),
    onSuccess: (res) => {
      const { paymentUrl } = res.data;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      }
    },
    onError: (error: ApiResponse<null>) => {
      notifications.show({
        title: 'Lỗi thanh toán',
        message: error.message || 'Không thể tạo yêu cầu thanh toán',
        color: 'red',
      });
    },
  });
};
