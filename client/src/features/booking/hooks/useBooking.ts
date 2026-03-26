import type { CreateBooking } from '@shared/index';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBookingApi } from '../services/booking.service';

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBooking) => createBookingApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seats'] });
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
    },
  });
};
