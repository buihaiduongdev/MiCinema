/**
 * ShowtimeForm — Form tạo/sửa suất chiếu
 *
 * Fields: phim (select), rạp (select), phòng (select), ngày giờ, giá vé
 * UC-21: Tạo suất chiếu — chọn phim + phòng + giờ chiếu + giá vé
 * UC-22: Sửa suất chiếu — đổi giờ, giá vé (chỉ khi chưa có ai đặt)
 */

import { useState, useEffect } from 'react';
import { Select, NumberInput, Button } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import 'dayjs/locale/vi';
import {
  useMoviesSelect,
  useCinemasSelect,
  useRoomsByCinema,
  useCreateShowtime,
  useUpdateShowtime,
} from '../hooks/useShowtimeCRUD';

interface ShowtimeFormProps {
  initialData?: {
    _id: string;
    movieId: any;
    cinemaId: any;
    roomId: any;
    startTime: string;
    ticketPrice: number;
  } | null;
  onSuccess: () => void;
}

export default function ShowtimeForm({
  initialData,
  onSuccess,
}: ShowtimeFormProps) {
  const isEdit = !!initialData;

  const [movieId, setMovieId] = useState<string | null>(null);
  const [cinemaId, setCinemaId] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [ticketPrice, setTicketPrice] = useState<number>(75000);

  // Fetch select options
  const { data: moviesRaw } = useMoviesSelect();
  const { data: cinemasRaw } = useCinemasSelect();
  const { data: roomsRaw } = useRoomsByCinema(cinemaId || '');

  // Mutations
  const createMutation = useCreateShowtime();
  const updateMutation = useUpdateShowtime();

  // Parse select data
  const movies: any[] =
    (moviesRaw as any)?.data?.data || (moviesRaw as any)?.data || [];
  const cinemas: any[] =
    (cinemasRaw as any)?.data?.data || (cinemasRaw as any)?.data || [];
  const rooms: any[] =
    (roomsRaw as any)?.data?.data || (roomsRaw as any)?.data || [];

  const movieOptions = movies.map((m: any) => ({
    value: m._id,
    label: `${m.title} (${m.duration} phút)`,
  }));

  const cinemaOptions = cinemas.map((c: any) => ({
    value: c._id,
    label: `${c.name} — ${c.city}`,
  }));

  const roomOptions = rooms.map((r: any) => ({
    value: r._id,
    label: `${r.name} (${r.roomType || 'Standard'}) — ${r.rows * r.cols} ghế`,
  }));

  // Pre-fill form khi edit
  useEffect(() => {
    if (initialData) {
      setMovieId(
        typeof initialData.movieId === 'object'
          ? initialData.movieId._id
          : initialData.movieId,
      );
      setCinemaId(
        typeof initialData.cinemaId === 'object'
          ? initialData.cinemaId._id
          : initialData.cinemaId,
      );
      setRoomId(
        typeof initialData.roomId === 'object'
          ? initialData.roomId._id
          : initialData.roomId,
      );
      // Set Date string cho DateTimePicker
      if (initialData.startTime) {
        setStartTime(initialData.startTime);
      }
      setTicketPrice(initialData.ticketPrice);
    }
  }, [initialData]);

  // Reset phòng khi đổi rạp
  useEffect(() => {
    if (!initialData) {
      setRoomId(null);
    }
  }, [cinemaId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!movieId || !cinemaId || !roomId || !startTime) return;

    const payload = {
      movieId,
      cinemaId,
      roomId,
      startTime: new Date(startTime).toISOString(),
      ticketPrice,
    };

    if (isEdit && initialData) {
      updateMutation.mutate(
        { id: initialData._id, data: payload },
        { onSuccess },
      );
    } else {
      createMutation.mutate(payload, { onSuccess });
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Chọn phim */}
      <Select
        label="Phim"
        placeholder="Chọn phim..."
        data={movieOptions}
        value={movieId}
        onChange={setMovieId}
        searchable
        clearable
        required
        styles={{
          input: {
            backgroundColor: '#060e20',
            border: '1px solid #424656',
            color: '#dae2fd',
          },
          label: { color: '#c2c6d8', fontWeight: 600, marginBottom: 4 },
          dropdown: { backgroundColor: '#131b2e', border: '1px solid #424656' },
          option: { color: '#dae2fd' },
        }}
      />

      {/* Chọn rạp */}
      <Select
        label="Chi nhánh rạp"
        placeholder="Chọn rạp..."
        data={cinemaOptions}
        value={cinemaId}
        onChange={setCinemaId}
        searchable
        clearable
        required
        styles={{
          input: {
            backgroundColor: '#060e20',
            border: '1px solid #424656',
            color: '#dae2fd',
          },
          label: { color: '#c2c6d8', fontWeight: 600, marginBottom: 4 },
          dropdown: { backgroundColor: '#131b2e', border: '1px solid #424656' },
          option: { color: '#dae2fd' },
        }}
      />

      {/* Chọn phòng */}
      <Select
        label="Phòng chiếu"
        placeholder={cinemaId ? 'Chọn phòng...' : 'Chọn rạp trước'}
        data={roomOptions}
        value={roomId}
        onChange={setRoomId}
        searchable
        clearable
        required
        disabled={!cinemaId}
        styles={{
          input: {
            backgroundColor: '#060e20',
            border: '1px solid #424656',
            color: '#dae2fd',
          },
          label: { color: '#c2c6d8', fontWeight: 600, marginBottom: 4 },
          dropdown: { backgroundColor: '#131b2e', border: '1px solid #424656' },
          option: { color: '#dae2fd' },
        }}
      />

      {/* Ngày & Giờ chiếu */}
      <DateTimePicker
        label="Ngày & Giờ chiếu"
        placeholder="Chọn ngày giờ chiếu..."
        value={startTime ? new Date(startTime) : null}
        onChange={(val) =>
          setStartTime(val ? new Date(val).toISOString() : null)
        }
        locale="vi"
        valueFormat="DD/MM/YYYY HH:mm"
        minDate={new Date()}
        required
        clearable
        styles={{
          input: {
            backgroundColor: '#060e20',
            border: '1px solid #424656',
            color: '#dae2fd',
          },
          label: { color: '#c2c6d8', fontWeight: 600, marginBottom: 4 },
          calendarHeader: { backgroundColor: '#131b2e' },
          calendarHeaderControl: { color: '#dae2fd' },
          calendarHeaderLevel: { color: '#dae2fd' },
          day: { color: '#dae2fd' },
          weekday: { color: '#8c90a1' },
          monthCell: { color: '#dae2fd' },
          yearsList: { backgroundColor: '#131b2e' },
          monthsList: { backgroundColor: '#131b2e' },
          timeInput: {
            backgroundColor: '#060e20',
            border: '1px solid #424656',
            color: '#dae2fd',
          },
        }}
        popoverProps={{
          styles: {
            dropdown: {
              backgroundColor: '#131b2e',
              border: '1px solid #424656',
            },
          },
        }}
      />

      {/* Giá vé */}
      <NumberInput
        label="Giá vé (VNĐ)"
        value={ticketPrice}
        onChange={(val) => setTicketPrice(Number(val) || 0)}
        min={0}
        step={5000}
        required
        thousandSeparator=","
        styles={{
          input: {
            backgroundColor: '#060e20',
            border: '1px solid #424656',
            color: '#dae2fd',
          },
          label: { color: '#c2c6d8', fontWeight: 600, marginBottom: 4 },
        }}
      />

      {/* Submit */}
      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={!movieId || !cinemaId || !roomId || !startTime}
          styles={{
            root: {
              background: '#0066ff',
              borderRadius: 12,
              fontWeight: 800,
              height: 44,
              paddingInline: 24,
            },
          }}
        >
          {isEdit ? 'Cập nhật suất chiếu' : 'Tạo suất chiếu'}
        </Button>
      </div>
    </form>
  );
}
