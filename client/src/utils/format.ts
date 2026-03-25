/**
 * Format Utilities
 *
 * Export:
 * - formatCurrency(amount: number): string — VD: "120.000 ₫"
 * - formatDate(date: string | Date): string — VD: "15/03/2026"
 * - formatDateTime(date: string | Date): string — VD: "15/03/2026 19:30"
 * - formatDuration(minutes: number): string — VD: "2h 15m"
 */

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('vi-VN');
};

export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatDuration = (minutes: number): string => {
  if (!Number.isFinite(minutes) || minutes <= 0) return 'N/A';

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};
