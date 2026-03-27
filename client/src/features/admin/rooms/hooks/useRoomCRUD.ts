import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../../lib/api-client';
import type { ApiResponse } from '@shared/types/api.type';
import type {
  CreateRoomInput,
  PatchRoomInput,
  RoomFilter,
  SeatConfig,
} from '@shared/schemas/room.schema';

export type AdminCinemaOption = {
  _id: string;
  name: string;
  city: string;
};

export type AdminRoomRow = {
  _id: string;
  name: string;
  roomType: string;
  rows: number;
  cols: number;
  isActive: boolean;
  cinemaId: string | { _id: string; name: string; city: string };
};

export type AdminRoomDetail = AdminRoomRow & {
  seats: SeatConfig[];
};

type RoomsListPayload = {
  data: AdminRoomRow[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
};

export function useAdminCinemasForRooms() {
  return useQuery({
    queryKey: ['admin-cinemas-for-rooms'],
    queryFn: async (): Promise<AdminCinemaOption[]> => {
      const res = (await apiClient.get(
        '/cinemas',
        { params: { limit: 100, page: 1 } },
      )) as ApiResponse<{ data: AdminCinemaOption[]; pagination: unknown }>;
      return res.data?.data ?? [];
    },
  });
}

export function useAdminRooms(filter: Partial<RoomFilter>) {
  return useQuery({
    queryKey: ['admin-rooms', filter],
    queryFn: async (): Promise<RoomsListPayload> => {
      const res = (await apiClient.get('/rooms', {
        params: {
          page: filter.page ?? 1,
          limit: filter.limit ?? 10,
          ...(filter.cinemaId ? { cinemaId: filter.cinemaId } : {}),
        },
      })) as ApiResponse<RoomsListPayload>;
      return res.data;
    },
  });
}

export function useAdminRoomById(id: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: ['admin-room', id],
    queryFn: async (): Promise<AdminRoomDetail> => {
      const res = (await apiClient.get(`/rooms/${id}`)) as ApiResponse<
        AdminRoomDetail & Record<string, unknown>
      >;
      return res.data as AdminRoomDetail;
    },
    enabled: enabled && !!id,
  });
}

export function useCreateRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateRoomInput) => {
      return apiClient.post<ApiResponse<AdminRoomRow>>('/rooms', body);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-rooms'] });
    },
  });
}

export function useUpdateRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: PatchRoomInput }) => {
      return apiClient.patch(`/rooms/${id}`, body);
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['admin-rooms'] });
      qc.invalidateQueries({ queryKey: ['admin-room', id] });
    },
  });
}

export function useDeactivateRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => apiClient.delete(`/rooms/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-rooms'] });
    },
  });
}
