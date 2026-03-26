import type { SeatSelection } from '@shared/schemas/booking.schema';

type SeatState = {
  selectedSeats: Map<string, SeatSelection>;
  totalPrice: number;
  maxSeats: number;
};

type SeatAction =
  | { type: 'SELECT_SEAT'; payload: SeatSelection }
  | { type: 'DESELECT_SEAT'; payload: string }
  | { type: 'RESET' }
  | { type: 'SET_MAX_SEATS'; payload: number };

export const initialSeatState: SeatState = {
  selectedSeats: new Map(),
  totalPrice: 0,
  maxSeats: 8,
};

export const seatReducer = (
  state: SeatState,
  action: SeatAction,
): SeatState => {
  switch (action.type) {
    case 'SELECT_SEAT': {
      const seat = action.payload;
      if (state.selectedSeats.size >= state.maxSeats) return state;

      const next = new Map(state.selectedSeats);
      next.set(seat.seatId, seat);

      return {
        ...state,
        selectedSeats: next,
        totalPrice: state.totalPrice + seat.price,
      };
    }
    case 'DESELECT_SEAT': {
      const seatId = action.payload;
      const seat = state.selectedSeats.get(seatId);

      if (!seat) return state;
      const next = new Map(state.selectedSeats);
      next.delete(seatId);

      return {
        ...state,
        selectedSeats: next,
        totalPrice: state.totalPrice - seat.price,
      };
    }

    case 'RESET':
      return { ...state, selectedSeats: new Map(), totalPrice: 0 };

    case 'SET_MAX_SEATS':
      return { ...state, maxSeats: action.payload };

    default:
      return state;
  }
};
