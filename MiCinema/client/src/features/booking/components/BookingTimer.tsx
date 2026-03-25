import { useEffect, useState } from 'react';

interface BookingTimerProps {
  expiresAt: Date | string;
  onExpired?: () => void;
}

export function BookingTimer({ expiresAt, onExpired }: BookingTimerProps) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const expiry =
        typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt;
      const diff = expiry.getTime() - Date.now();
      return Math.max(0, diff);
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      if (remaining <= 0 && onExpired) {
        clearInterval(interval);
        onExpired();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpired]);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);
  const progress = (timeLeft / (10 * 60 * 1000)) * 100;
  const isWarning = minutes < 1;

  return (
    <div
      style={{
        background: '#f9fafb',
        borderRadius: 8,
        padding: 12,
        border: isWarning ? '2px solid #dc2626' : '1px solid #e5e7eb',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        <span style={{ color: '#6b7280', fontSize: 12, fontWeight: 600 }}>
          Giữ chỗ còn lại
        </span>
        <span
          style={{
            fontSize: 20,
            fontWeight: 800,
            fontFamily: 'ui-monospace, monospace',
            color: isWarning ? '#dc2626' : '#1e3a5f',
          }}
        >
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
      </div>

      <div
        style={{
          width: '100%',
          height: 6,
          background: '#e5e7eb',
          borderRadius: 999,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            background:
              progress > 50
                ? 'linear-gradient(90deg, #16a34a, #15803d)'
                : progress > 20
                  ? 'linear-gradient(90deg, #eab308, #ca8a04)'
                  : 'linear-gradient(90deg, #dc2626, #b91c1c)',
            width: `${progress}%`,
            transition: 'width 1s linear',
            borderRadius: 999,
          }}
        />
      </div>

      {isWarning && (
        <p
          style={{
            color: '#dc2626',
            fontSize: 11,
            marginTop: 8,
            textAlign: 'center',
            fontWeight: 600,
          }}
        >
          Sắp hết thời gian giữ ghế
        </p>
      )}
    </div>
  );
}
