import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createFoodOrderApi,
  getFoodOrdersByBooking,
} from '../services/food.service';
import type { CreateFoodOrderInput } from '@shared/index';
import { notifications } from '@mantine/notifications';

export const useOrderFood = () => {
  return useMutation({
    mutationFn: (data: CreateFoodOrderInput) => createFoodOrderApi(data),
    onSuccess: (res) => {
      notifications.show({
        title: 'Thành công',
        message: 'Đã đặt đồ ăn thành công!',
        color: 'green',
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Lỗi',
        message: error.response?.data?.message || 'Không thể đặt đồ ăn',
        color: 'red',
      });
    },
  });
};

export const useFoodOrdersByBooking = (bookingId: string) => {
  return useQuery({
    queryKey: ['food-orders', bookingId],
    queryFn: async () => (await getFoodOrdersByBooking(bookingId)).data,
    enabled: !!bookingId,
  });
};
