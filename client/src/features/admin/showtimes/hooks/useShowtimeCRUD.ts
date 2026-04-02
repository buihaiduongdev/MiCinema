/**
 * useShowtimeCRUD — CRUD suất chiếu
 *
 * Export: useShowtimes, useCreateShowtime, useUpdateShowtime, useCancelShowtime
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import {
  getShowtimes,
  createShowtime,
  updateShowtime,
  cancelShowtime,
  getMoviesForSelect,
  getCinemasForSelect,
  getRoomsByCinema,
} from '../../services/admin.service';

/** Lấy danh sách suất chiếu (có filter + pagination) */
export const useShowtimes = (params?: Record<string, any>) =>
  useQuery({
    queryKey: ['showtimes', 'admin', params],
    queryFn: () => getShowtimes(params),
    staleTime: 1 * 60 * 1000,
  });

/** Lấy danh sách phim (cho select trong form) */
export const useMoviesSelect = () =>
  useQuery({
    queryKey: ['movies', 'select'],
    queryFn: getMoviesForSelect,
    staleTime: 5 * 60 * 1000,
  });

/** Lấy danh sách rạp (cho select trong form) */
export const useCinemasSelect = () =>
  useQuery({
    queryKey: ['cinemas', 'select'],
    queryFn: getCinemasForSelect,
    staleTime: 5 * 60 * 1000,
  });

/** Lấy phòng chiếu theo rạp (cho select trong form) */
export const useRoomsByCinema = (cinemaId: string) =>
  useQuery({
    queryKey: ['rooms', 'byCinema', cinemaId],
    queryFn: () => getRoomsByCinema(cinemaId),
    staleTime: 5 * 60 * 1000,
    enabled: !!cinemaId,
  });

/** Tạo suất chiếu mới (UC-21) */
export const useCreateShowtime = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createShowtime,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['showtimes'] });
      notifications.show({
        title: 'Thành công',
        message: 'Tạo suất chiếu mới thành công',
        color: 'green',
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Lỗi',
        message: error?.response?.data?.message || error.message || 'Tạo suất chiếu thất bại',
        color: 'red',
      });
    },
  });
};

/** Cập nhật suất chiếu (UC-22) */
export const useUpdateShowtime = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateShowtime(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['showtimes'] });
      notifications.show({
        title: 'Thành công',
        message: 'Cập nhật suất chiếu thành công',
        color: 'green',
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Lỗi',
        message: error?.response?.data?.message || error.message || 'Cập nhật suất chiếu thất bại',
        color: 'red',
      });
    },
  });
};

/** Huỷ suất chiếu (UC-23) */
export const useCancelShowtime = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelShowtime(id),
    onSuccess: (_data: any) => {
      queryClient.invalidateQueries({ queryKey: ['showtimes'] });
      notifications.show({
        title: 'Đã huỷ',
        message: 'Suất chiếu đã được huỷ. Vé liên quan đã hoàn trả.',
        color: 'blue',
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Lỗi',
        message: error?.response?.data?.message || error.message || 'Huỷ suất chiếu thất bại',
        color: 'red',
      });
    },
  });
};
