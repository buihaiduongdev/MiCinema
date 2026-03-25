import { useReducer, useCallback } from 'react';
import { SeatMap } from './SeatMap';
import { useSeatMap } from '../hooks/useSeatMap';
import { seatReducer, initialSeatState } from '../reducers/seatReducer';
import type { Seat } from '@/types/seat';

interface SeatSelectionProps {
  showtimeId: string;
  onSelectionChange?: (seats: Seat[]) => void;
  maxSeats?: number;
}

export function SeatSelection({
  showtimeId,
  onSelectionChange,
  maxSeats = 10,
}: SeatSelectionProps) {
  const [state, dispatch] = useReducer(seatReducer, initialSeatState);
  const { seats, isLoading } = useSeatMap(showtimeId);

  const handleSeatClick = useCallback(
    (seatId: string) => {
      const seat = seats.find((s) => s.id === seatId);
      if (!seat) return;

      const isSelected = state.selectedSeats.some((s) => s.id === seatId);

      if (isSelected) {
        dispatch({ type: 'DESELECT_SEAT', payload: seatId });
        const newSeats = state.selectedSeats.filter((s) => s.id !== seatId);
        onSelectionChange?.(newSeats);
      } else {
        if (state.selectedSeats.length >= maxSeats) {
          alert(`Bạn chỉ có thể chọn tối đa ${maxSeats} ghế`);
          return;
        }
        dispatch({ type: 'SELECT_SEAT', payload: seat });
        onSelectionChange?.([...state.selectedSeats, seat]);
      }
    },
    [seats, state.selectedSeats, maxSeats, onSelectionChange]
  );

  return (
    <div>
      <SeatMap
        seats={seats}
        selectedSeats={state.selectedSeats.map((s) => s.id)}
        onSeatClick={handleSeatClick}
        loading={isLoading}
      />
    </div>
  );
}
