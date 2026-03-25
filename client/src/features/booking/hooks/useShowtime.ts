import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import type { IShowtime } from '@/types/booking';

export function useShowtime(showtimeId: string | undefined) {
  return useQuery<IShowtime>({
    queryKey: ['showtime', showtimeId],
    queryFn: () => apiClient.get(`/showtimes/${showtimeId}`),
    enabled: !!showtimeId,
  });
}
