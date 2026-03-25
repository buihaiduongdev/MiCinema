import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export interface ISeat {
  row: string;
  col: number;
  type: 'NORMAL' | 'VIP' | 'SWEETBOX';
  isActive: boolean;
}

export interface IRoom {
  _id?: string;
  name: string;
  rows: number;
  colsPerRow: number;
  type: string;
  isActive: boolean;
  seats: ISeat[];
}

export function useRooms() {
  return useQuery<IRoom[]>({
    queryKey: ['rooms'],
    queryFn: () => apiClient.get('/rooms'),
  });
}

/** Danh sách phòng đang hoạt động — dùng cho trang chủ & /rooms (API public) */
export function useActiveRooms() {
  return useQuery<IRoom[]>({
    queryKey: ['rooms', 'active'],
    queryFn: () => apiClient.get('/rooms?isActive=true'),
    staleTime: 60_000,
  });
}

export function useRoom(roomId: string) {
  return useQuery<IRoom>({
    queryKey: ['room', roomId],
    queryFn: () => apiClient.get(`/rooms/${roomId}`),
    enabled: !!roomId,
  });
}

export function useCreateRoom() {
  const queryClient = useQueryClient();

  return useMutation<IRoom, Error, Omit<IRoom, '_id'>>({
    mutationFn: (data) => apiClient.post('/rooms', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });
}

export function useUpdateRoom(roomId: string) {
  const queryClient = useQueryClient();

  return useMutation<IRoom, Error, Partial<IRoom>>({
    mutationFn: (data) => apiClient.put(`/rooms/${roomId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['room', roomId] });
    },
  });
}

export function useDeleteRoom() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (roomId) => apiClient.delete(`/rooms/${roomId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });
}

export function useUpdateSeat(roomId: string) {
  const queryClient = useQueryClient();

  return useMutation<IRoom, Error, { seatId: string; data: Partial<ISeat> }>({
    mutationFn: ({ seatId, data }) =>
      apiClient.put(`/rooms/${roomId}/seats/${seatId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['room', roomId] });
    },
  });
}
