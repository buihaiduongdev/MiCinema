import type { Seat } from '@/types/seat';

export interface SeatState {
  selectedSeats: Seat[];
}

export type SeatAction =
  | { type: 'SELECT_SEAT'; payload: Seat }
  | { type: 'DESELECT_SEAT'; payload: string }
  | { type: 'CLEAR_SEATS' };

export const initialSeatState: SeatState = {
  selectedSeats: [],
};

export function seatReducer(state: SeatState, action: SeatAction): SeatState {
  switch (action.type) {
    case 'SELECT_SEAT': {
      const exists = state.selectedSeats.some(
        (s) => s.id === action.payload.id
      );
      if (exists) return state;
      return {
        ...state,
        selectedSeats: [...state.selectedSeats, action.payload],
      };
    }

    case 'DESELECT_SEAT': {
      return {
        ...state,
        selectedSeats: state.selectedSeats.filter(
          (s) => s.id !== action.payload
        ),
      };
    }

    case 'CLEAR_SEATS': {
      return {
        ...state,
        selectedSeats: [],
      };
    }

    default:
      return state;
  }
}
