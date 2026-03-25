import { useMemo } from 'react';
import { BookingTimer } from './BookingTimer';
import type { Seat } from '@/types/seat';
import type { FoodCartItem } from '@/types/product';
import type { IShowtime } from '@/types/booking';

interface BookingSummaryProps {
  showtime?: IShowtime | null;
  selectedSeats: Seat[];
  foodItems: FoodCartItem[];
  expiresAt?: Date | string;
  onExpired?: () => void;
}

const navy = '#1e3a5f';
const gold = '#c9a227';

export function BookingSummary({
  showtime,
  selectedSeats,
  foodItems,
  expiresAt,
  onExpired,
}: BookingSummaryProps) {
  const totalAmount = useMemo(() => {
    const seatsTotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    const foodTotal = foodItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    return seatsTotal + foodTotal;
  }, [selectedSeats, foodItems]);

  const movie =
    showtime && typeof showtime.movieId !== 'string'
      ? showtime.movieId
      : undefined;
  const room =
    showtime && typeof showtime.roomId !== 'string'
      ? showtime.roomId
      : undefined;

  const start = showtime ? new Date(showtime.startTime) : null;
  const endTime = useMemo(() => {
    if (!start || !movie?.duration) return null;
    const end = new Date(start.getTime() + movie.duration * 60 * 1000);
    return end;
  }, [start, movie?.duration]);

  const timeRange =
    start &&
    (endTime
      ? `${start.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} – ${endTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`
      : start.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }));

  const seatLabel =
    selectedSeats.length > 0
      ? selectedSeats.map((s) => s.id).join(', ')
      : '—';

  return (
    <div
      style={{
        position: 'sticky',
        top: 16,
        background: '#ffffff',
        borderRadius: 8,
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 24px rgba(15, 23, 42, 0.06)',
        padding: 20,
        color: '#111827',
      }}
    >
      <h2
        style={{
          margin: '0 0 16px',
          fontSize: 16,
          fontWeight: 700,
          color: navy,
          borderBottom: `2px solid ${gold}`,
          paddingBottom: 10,
        }}
      >
        Thông tin vé
      </h2>

      {movie && (
        <div
          style={{
            display: 'flex',
            gap: 14,
            marginBottom: 18,
            paddingBottom: 16,
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          {movie.poster ? (
            <img
              src={movie.poster}
              alt={movie.title}
              style={{
                width: 96,
                height: 140,
                objectFit: 'cover',
                borderRadius: 6,
                border: '1px solid #e5e7eb',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}
            />
          ) : (
            <div
              style={{
                width: 96,
                height: 140,
                borderRadius: 6,
                background: '#f3f4f6',
                border: '1px dashed #d1d5db',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                color: '#9ca3af',
                textAlign: 'center',
                padding: 8,
              }}
            >
              Poster
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 15, lineHeight: 1.35 }}>
              {movie.title}
            </p>
            {movie.duration ? (
              <p style={{ margin: '8px 0 0', fontSize: 13, color: '#6b7280' }}>
                {movie.duration} phút
              </p>
            ) : null}
          </div>
        </div>
      )}

      <dl
        style={{
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          fontSize: 14,
        }}
      >
        {showtime && start && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <dt style={{ margin: 0, color: '#6b7280', fontWeight: 500 }}>Ngày</dt>
              <dd style={{ margin: 0, fontWeight: 600, textAlign: 'right' }}>
                {start.toLocaleDateString('vi-VN')}
              </dd>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <dt style={{ margin: 0, color: '#6b7280', fontWeight: 500 }}>Thời gian</dt>
              <dd style={{ margin: 0, fontWeight: 600, textAlign: 'right' }}>
                {timeRange}
              </dd>
            </div>
          </>
        )}
        {room && (
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <dt style={{ margin: 0, color: '#6b7280', fontWeight: 500 }}>Rạp</dt>
            <dd style={{ margin: 0, fontWeight: 600, textAlign: 'right' }}>
              {room.name}
            </dd>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <dt style={{ margin: 0, color: '#6b7280', fontWeight: 500 }}>Ghế</dt>
          <dd
            style={{
              margin: 0,
              fontWeight: 700,
              color: selectedSeats.length ? '#16a34a' : '#9ca3af',
              textAlign: 'right',
              maxWidth: '58%',
              wordBreak: 'break-word',
            }}
          >
            {seatLabel}
          </dd>
        </div>
      </dl>

      {foodItems.length > 0 && (
        <div
          style={{
            marginTop: 16,
            paddingTop: 14,
            borderTop: '1px solid #e5e7eb',
          }}
        >
          <p style={{ margin: '0 0 8px', fontWeight: 600, fontSize: 13, color: navy }}>
            Đồ ăn / nước
          </p>
          {foodItems.map((item) => (
            <div
              key={item.product._id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 13,
                color: '#374151',
                marginBottom: 6,
              }}
            >
              <span>
                {item.product.name} × {item.quantity}
              </span>
              <span style={{ fontWeight: 600 }}>
                {(item.product.price * item.quantity).toLocaleString('vi-VN')}đ
              </span>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          marginTop: 18,
          paddingTop: 14,
          borderTop: '2px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 15, color: navy }}>Tổng tiền</span>
        <span style={{ fontWeight: 800, fontSize: 20, color: gold }}>
          {totalAmount.toLocaleString('vi-VN')}đ
        </span>
      </div>

      {expiresAt && (
        <div style={{ marginTop: 14 }}>
          <BookingTimer expiresAt={expiresAt} onExpired={onExpired} />
        </div>
      )}
    </div>
  );
}
