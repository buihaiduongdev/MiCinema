import type { CreateBooking } from '@shared/index';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createBookingApi,
  getBookingDetailApi,
  getMyBookingApi,
  cancelBookingApi,
} from '../services/booking.service';
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
export const useBookingDetail = (id: string) => {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: () => getBookingDetailApi(id).then((res) => res.data),
    enabled: !!id,
  });
};
export const useMyBookings = (query?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['my-bookings', query],
    queryFn: () => getMyBookingApi(query).then((res) => res.data),
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cancelBookingApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
    },
  });
};
