import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import apiClient from '@/lib/api-client';
import { useSocket } from '@/hooks/useSocket';
import type { SeatMapData, Seat, SeatUpdateEvent } from '@/types/seat';

export function useSeatMap(showtimeId: string) {
  const [seats, setSeats] = useState<Seat[]>([]);
  const socket = useSocket();

  const query = useQuery<SeatMapData>({
    queryKey: ['seatMap', showtimeId],
    queryFn: () => apiClient.get(`/showtimes/${showtimeId}/seats`),
    refetchInterval: 30000,
    staleTime: 10000,
    enabled: !!showtimeId,
  });

  useEffect(() => {
    if (query.data?.seats) {
      setSeats(query.data.seats);
    }
  }, [query.data]);

  useEffect(() => {
    if (!socket || !showtimeId) return;

    socket.emit('join-showtime', showtimeId);

    const handleSeatUpdate = (update: SeatUpdateEvent) => {
      setSeats((prev) =>
        prev.map((seat) =>
          seat.id === update.seatId
            ? { ...seat, status: update.status, heldUntil: update.heldUntil }
            : seat
        )
      );
    };

    socket.on('seat-updated', handleSeatUpdate);

    return () => {
      socket.emit('leave-showtime', showtimeId);
      socket.off('seat-updated', handleSeatUpdate);
    };
  }, [socket, showtimeId]);

  return {
    seats,
    room: query.data?.room,
    ticketPrice: query.data?.ticketPrice,
    priceMultiplier: query.data?.priceMultiplier,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
