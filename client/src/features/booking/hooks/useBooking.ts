import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import type {
  CreateBookingInput,
  ConfirmBookingInput,
  IBooking,
} from '@/types/booking';

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateBookingInput) =>
      apiClient.post('/bookings', input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

export function useConfirmBooking(bookingId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ConfirmBookingInput) =>
      apiClient.post(`/bookings/${bookingId}/confirm`, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking', bookingId] });
    },
  });
}

export function useBooking(bookingId: string) {
  return useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => apiClient.get(`/bookings/${bookingId}`),
    enabled: !!bookingId,
  });
}

export function useCancelBooking(bookingId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient.delete(`/bookings/${bookingId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

export function useHoldSeats(showtimeId: string) {
  return useMutation({
    mutationFn: (seats: string[]) =>
      apiClient.post(`/showtimes/${showtimeId}/seats/hold`, { seats }),
  });
}

export function useReleaseSeats(showtimeId: string) {
  return useMutation({
    mutationFn: (seats: string[]) =>
      apiClient.delete(`/showtimes/${showtimeId}/seats/hold`, { data: { seats } }),
  });
}
