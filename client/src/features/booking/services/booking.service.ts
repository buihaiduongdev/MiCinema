import apiClient from '@/lib/api-client';
import type {
  ApiResponse,
  BookingType,
  CreateBooking,
  RoomType,
  ShowtimeType,
  PaginationMeta,
} from '@shared/index';

export const getSeatMapApi = (
  showtimeId: string,
): Promise<
  ApiResponse<{
    showtime: ShowtimeType & { roomId: RoomType };
    bookedSeatIds: string[];
  }>
> => {
  return apiClient.get(`/booking/seats/${showtimeId}`);
};

export const createBookingApi = (
  data: CreateBooking,
): Promise<ApiResponse<BookingType>> => {
  return apiClient.post('/booking', data);
};

export const getMyBookingApi = (query?: {
  page?: number;
  limit?: number;
}): Promise<ApiResponse<{ bookings: BookingType[]; meta: PaginationMeta }>> => {
  return apiClient.get('booking/my-bookings', { params: query });
};

export const getBookingDetailApi = (
  id: string,
): Promise<ApiResponse<BookingType>> => {
  return apiClient.get(`/booking/${id}`);
};
