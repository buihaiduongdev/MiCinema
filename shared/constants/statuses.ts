/**
 * Movie, Booking, and Showtime Statuses
 */
export const MOVIE_STATUS = {
  UPCOMING: 'UPCOMING',
  RELEASED: 'RELEASED',
  ENDED: 'ENDED',
} as const;

export type MovieStatus = (typeof MOVIE_STATUS)[keyof typeof MOVIE_STATUS];

export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
} as const;

export type BookingStatus =
  (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];

export const SHOWTIME_STATUS = {
  OPEN: 'OPEN',
  FINISHED: 'FINISHED',
  CANCELLED: 'CANCELLED',
} as const;

export type ShowtimeStatus =
  (typeof SHOWTIME_STATUS)[keyof typeof SHOWTIME_STATUS];

export const MEMBERSHIP_TIER = {
  BRONZE: 'BRONZE',
  SILVER: 'SILVER',
  GOLD: 'GOLD',
} as const;

export type MembershipTier =
  (typeof MEMBERSHIP_TIER)[keyof typeof MEMBERSHIP_TIER];

export const SEAT_STATUS = {
  AVAILABLE: 'AVAILABLE',
  BOOKED: 'BOOKED',
  HELD: 'HELD',
} as const;

export type SeatStatus = (typeof SEAT_STATUS)[keyof typeof SEAT_STATUS];

export const PAYMENT_METHOD = {
  CASH: 'CASH',
  MOMO: 'MOMO',
  VNPAY: 'VNPAY',
  ZALOPAY: 'ZALOPAY',
} as const;

export type PaymentMethod =
  (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];
