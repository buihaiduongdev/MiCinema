import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../../lib/api-client';
import type { ApiResponse } from '@shared/types/api.type';
import type { PaginationMeta } from '@shared/types/pagination.type';

export type AdminBookingRow = {
  _id: string;
  status: string;
  totalPrice: number;
  seats: Array<{ seatId: string; row?: string; col?: number }>;
  userId?: unknown;
  showtimeId?: unknown;
  createdAt?: string;
};

export type AdminBookingsData = {
  bookings: AdminBookingRow[];
  meta: PaginationMeta;
};

export type AdminBookingsQuery = {
  page: number;
  limit: number;
  showtimeId?: string;
  status?: string;
  customerSearch?: string;
};

/**
 * UC-24: GET /api/booking/admin — danh sách + lọc (STAFF/ADMIN)
 */
export const useAdminBookingsList = (params: AdminBookingsQuery) => {
  return useQuery({
    queryKey: ['admin-bookings', params],
    queryFn: async () => {
      const entries = Object.entries({
        page: params.page,
        limit: params.limit,
        showtimeId: params.showtimeId?.trim() || undefined,
        status:
          params.status && params.status !== 'ALL' ? params.status : undefined,
        customerSearch: params.customerSearch?.trim() || undefined,
      }).filter(([, v]) => v !== undefined && v !== '');
      const clean = Object.fromEntries(entries);
      const res = await apiClient.get<ApiResponse<AdminBookingsData>>(
        'booking/admin',
        { params: clean },
      );
      return res;
    },
  });
};

export const useConfirmBookingPayment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (bookingId: string) => {
      return apiClient.patch<ApiResponse<unknown>>(
        `booking/${bookingId}/confirm-payment`,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-bookings'] });
    },
  });
};

export const useTicketCheckIn = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ticketCode: string) => {
      return apiClient.post<ApiResponse<unknown>>('tickets/check-in', {
        ticketCode,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-bookings'] });
    },
  });
};

export const useTicketRefund = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      ticketId: string;
      refundAmount?: number;
      reason?: string;
    }) => {
      const { ticketId, ...body } = payload;
      return apiClient.post<ApiResponse<unknown>>(
        `tickets/${ticketId}/refund`,
        body,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-bookings'] });
    },
  });
};
