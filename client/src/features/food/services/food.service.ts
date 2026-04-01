import apiClient from '@/lib/api-client';
import type {
  ApiResponse,
  CreateFoodOrderInput,
  ProductListQuery,
  PaginationMeta,
} from '@shared/index';

export const getProductApi = async (
  query?: ProductListQuery,
): Promise<ApiResponse<{ data: any[]; pagination: PaginationMeta }>> => {
  return apiClient.get('/food/products', { params: query });
};

export const createFoodOrderApi = (
  data: CreateFoodOrderInput,
): Promise<ApiResponse<any>> => {
  return apiClient.post('/food/orders', data);
};

export const getFoodOrdersByBooking = (
  bookingId: string,
): Promise<ApiResponse<any>> => {
  return apiClient.get(`/food/orders/by-booking/${bookingId}`);
};
