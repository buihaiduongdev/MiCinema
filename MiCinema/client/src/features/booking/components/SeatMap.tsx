import { useMemo } from 'react';
import { Seat } from './Seat';
import { SeatLegend } from './SeatLegend';
import type { Seat as SeatType } from '@/types/seat';

interface SeatMapProps {
  seats: SeatType[];
  selectedSeats: string[];
  onSeatClick: (seatId: string) => void;
  loading?: boolean;
}

export function SeatMap({
  seats,
  selectedSeats,
  onSeatClick,
  loading,
}: SeatMapProps) {
  const seatsByRow = useMemo(() => {
    const grouped = seats.reduce(
      (acc, seat) => {
        if (!acc[seat.row]) acc[seat.row] = [];
        acc[seat.row].push(seat);
        return acc;
      },
      {} as Record<string, SeatType[]>
    );
    Object.keys(grouped).forEach((row) => {
      grouped[row].sort((a, b) => a.col - b.col);
    });
    return grouped;
  }, [seats]);

  const rows = useMemo(
    () => Object.keys(seatsByRow).sort(),
    [seatsByRow]
  );

  const maxCols = useMemo(() => {
    if (!Object.keys(seatsByRow).length) return 0;
    return Math.max(...Object.values(seatsByRow).map((row) => row.length));
  }, [seatsByRow]);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 320,
          background: '#ffffff',
          borderRadius: 8,
          border: '1px solid #e5e7eb',
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: '3px solid #e5e7eb',
            borderTopColor: '#1e3a5f',
            borderRadius: '50%',
            animation: 'spin 0.9s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 8,
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 24px rgba(15, 23, 42, 0.06)',
        padding: '28px 20px 20px',
      }}
    >
      {/* Màn hình dạng thang */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div
          style={{
            margin: '0 auto',
            width: 'min(92%, 720px)',
            height: 36,
            background: 'linear-gradient(180deg, #e5e7eb 0%, #d1d5db 45%, #9ca3af 100%)',
            clipPath: 'polygon(6% 0, 94% 0, 100% 100%, 0% 100%)',
            boxShadow: 'inset 0 -2px 6px rgba(0,0,0,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '0.2em',
              color: '#4b5563',
            }}
          >
            MÀN HÌNH
          </span>
        </div>
      </div>

      <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
        {/* Số cột */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 10,
            paddingLeft: 44,
            minWidth: maxCols * 40 + 44,
          }}
        >
          {Array.from({ length: maxCols }, (_, i) => (
            <div
              key={i}
              style={{
                width: 36,
                textAlign: 'center',
                fontSize: 11,
                fontWeight: 600,
                color: '#6b7280',
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {rows.map((row) => (
            <div
              key={row}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                minWidth: maxCols * 40 + 88,
              }}
            >
              <div
                style={{
                  width: 36,
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: 14,
                  color: '#1e3a5f',
                }}
              >
                {row}
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  flex: 1,
                  justifyContent: 'center',
                  flexWrap: 'nowrap',
                }}
              >
                {seatsByRow[row].map((seat) => (
                  <Seat
                    key={seat.id}
                    seat={seat}
                    isSelected={selectedSeats.includes(seat.id)}
                    onClick={() => onSeatClick(seat.id)}
                  />
                ))}
              </div>
              <div
                style={{
                  width: 36,
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: 14,
                  color: '#1e3a5f',
                }}
              >
                {row}
              </div>
            </div>
          ))}
        </div>
      </div>

      <SeatLegend />
    </div>
  );
}
