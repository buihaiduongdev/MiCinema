import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getMyBookingApi } from '../services/booking.service';

export const useMyBookings = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['my-bookings', page, limit],
    queryFn: () => getMyBookingApi({ page, limit }).then((res) => res.data),
    placeholderData: keepPreviousData,
  });
};
