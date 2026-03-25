/**
 * Seat and Room Types
 */
export const SEAT_TYPE = {
  NORMAL: 'NORMAL',
  VIP: 'VIP',
  SWEETBOX: 'SWEETBOX',
} as const;

export type SeatType = (typeof SEAT_TYPE)[keyof typeof SEAT_TYPE];

export const ROOM_TYPE = {
  STANDARD: 'STANDARD',
  VIP: 'VIP',
  IMAX: 'IMAX',
  FOUR_DX: '4DX',
} as const;

export type RoomType = (typeof ROOM_TYPE)[keyof typeof ROOM_TYPE];

export const PRICE_MULTIPLIER = {
  NORMAL: 1,
  VIP: 1.5,
  SWEETBOX: 2,
} as const;
