import { memo } from 'react';
import type { Seat as SeatType } from '@/types/seat';

interface SeatProps {
  seat: SeatType;
  isSelected: boolean;
  onClick: () => void;
}

/** Giao diện ghế kiểu rạp Metiz: nền trắng + viền theo loại; đã chọn xanh; đã bán xám */
export const Seat = memo(function Seat({
  seat,
  isSelected,
  onClick,
}: SeatProps) {
  const isClickable =
    seat.status === 'AVAILABLE' || (seat.status === 'HELD' && isSelected);
  const isBooked = seat.status === 'BOOKED';
  const isHeld = seat.status === 'HELD' && !isSelected;

  const baseBorder = (() => {
    if (seat.type === 'VIP') return '2px solid #ca8a04';
    if (seat.type === 'SWEETBOX') return '2px solid #e879a9';
    return '1px solid #d1d5db';
  })();

  const style: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: seat.type === 'SWEETBOX' ? 56 : 32,
    height: 32,
    padding: seat.type === 'SWEETBOX' ? '0 10px' : 0,
    background: isSelected
      ? '#16a34a'
      : isBooked
        ? '#9ca3af'
        : isHeld
          ? '#fde68a'
          : '#ffffff',
    border:
      isSelected
        ? '2px solid #15803d'
        : isBooked
          ? '1px solid #6b7280'
          : isHeld
            ? '2px solid #f59e0b'
            : baseBorder,
    borderRadius: '4px 4px 2px 2px',
    cursor: isClickable ? 'pointer' : 'not-allowed',
    fontSize: 11,
    fontWeight: 600,
    color: isSelected || isBooked ? '#ffffff' : '#1f2937',
    boxShadow: isSelected
      ? '0 2px 8px rgba(22, 163, 74, 0.35)'
      : '0 1px 2px rgba(15, 23, 42, 0.08)',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
    opacity: isBooked ? 0.85 : 1,
  };

  const label =
    seat.type === 'SWEETBOX' ? '♥' : String(seat.col);

  return (
    <button
      type="button"
      style={style}
      onMouseEnter={(e) => {
        if (isClickable && !isSelected) {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 4px 10px rgba(15, 23, 42, 0.12)';
        }
      }}
      onMouseLeave={(e) => {
        if (isClickable && !isSelected) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 1px 2px rgba(15, 23, 42, 0.08)';
        }
      }}
      onClick={isClickable ? onClick : undefined}
      disabled={!isClickable}
      title={`${seat.id} — ${seat.type} — ${seat.price.toLocaleString('vi-VN')}đ`}
    >
      {isBooked ? (
        <span style={{ fontSize: 12, fontWeight: 700 }}>×</span>
      ) : (
        <span>{label}</span>
      )}
    </button>
  );
});
