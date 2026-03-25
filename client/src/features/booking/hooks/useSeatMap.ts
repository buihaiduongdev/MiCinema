import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getSeatMapApi } from '../services/booking.service';

export const useSeatMap = (showtimeId: string) => {
  return useQuery({
    queryKey: ['seats', showtimeId],
    queryFn: () => getSeatMapApi(showtimeId).then((res) => res.data),
    staleTime: 10 * 1000,
    refetchInterval: 30 * 1000,
    enabled: !!showtimeId,
    placeholderData: keepPreviousData,
  });
};
