import { SEAT_TYPE, SEAT_STATUS } from '@shared/constants/seat-types';
import type { SeatType } from '@shared/constants/seat-types';
import type { SeatStatus } from '@shared/constants/statuses';

export interface Seat {
  id: string;
  row: string;
  col: number;
  type: SeatType;
  status: SeatStatus;
  price: number;
  heldUntil?: string;
}

export interface SeatMapData {
  room: {
    name: string;
    rows: number;
    cols: number;
    type: string;
  };
  seats: Seat[];
  ticketPrice: number;
  priceMultiplier: Record<SeatType, number>;
}

export interface SeatUpdateEvent {
  seatId: string;
  status: SeatStatus;
  heldUntil?: string;
}
