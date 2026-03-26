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

/** Vé đơn lẻ (sau khi booking PAID) — check-in / huỷ / hoàn tiền */
export const TICKET_STATUS = {
  ISSUED: 'ISSUED',
  USED: 'USED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
} as const;

export type TicketStatus =
  (typeof TICKET_STATUS)[keyof typeof TICKET_STATUS];

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

export const LOYALTY_ACTION = {
  EARN: 'EARN',
  REDEEM: 'REDEEM',
  EXPIRE: 'EXPIRE',
} as const;

export type LoyaltyAction =
  (typeof LOYALTY_ACTION)[keyof typeof LOYALTY_ACTION];
