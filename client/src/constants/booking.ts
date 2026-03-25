/**
 * Suất chiếu mặc định cho CTA đặt vé — bắt buộc cấu hình qua môi trường khi triển khai.
 */
const raw = (import.meta.env.VITE_DEFAULT_SHOWTIME_ID as string | undefined)?.trim();

export const DEFAULT_SHOWTIME_ID = raw ?? '';

export function hasDefaultShowtime(): boolean {
  return DEFAULT_SHOWTIME_ID.length > 0;
}

export function bookingPath(showtimeId: string) {
  return `/booking/${showtimeId}`;
}

/** Đường dẫn đặt vé nhanh, hoặc null nếu chưa cấu hình env */
export function defaultBookingPath(): string | null {
  return hasDefaultShowtime() ? bookingPath(DEFAULT_SHOWTIME_ID) : null;
}
