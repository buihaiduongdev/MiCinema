import { useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SeatMap } from '../components/SeatMap';
import { BookingSummary } from '../components/BookingSummary';
import { FoodMenu } from '../../food/components/FoodMenu';
import { useSeatMap } from '../hooks/useSeatMap';
import { useShowtime } from '../hooks/useShowtime';
import { useCreateBooking, useHoldSeats } from '../hooks/useBooking';
import { useFoodMenu } from '../../food/hooks/useFoodMenu';
const HEADER_BG = '#152238';
const GOLD = '#d4af37';
const GOLD_BAR = 'linear-gradient(180deg, #e8c547 0%, #c9a227 55%, #a67c00 100%)';

export function BookingPage() {
  const { showtimeId } = useParams<{ showtimeId: string }>();
  const navigate = useNavigate();

  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [foodQuantities, setFoodQuantities] = useState<Map<string, number>>(
    new Map()
  );
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);

  const { data: showtime, isLoading: showtimeLoading } = useShowtime(showtimeId);
  const { seats, isLoading: seatsLoading } = useSeatMap(showtimeId!);
  const { data: products } = useFoodMenu();
  const holdSeatsMutation = useHoldSeats(showtimeId!);
  const createBookingMutation = useCreateBooking();

  const isLoading = showtimeLoading || seatsLoading;

  const selectedSeats = useMemo(() => {
    return seats.filter((seat) => selectedSeatIds.includes(seat.id));
  }, [seats, selectedSeatIds]);

  const foodItems = useMemo(() => {
    if (!products) return [];
    return Array.from(foodQuantities.entries())
      .filter(([_, quantity]) => quantity > 0)
      .map(([productId, quantity]) => {
        const product = products.find((p) => p._id === productId);
        return product ? { product, quantity } : null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [products, foodQuantities]);

  const handleSeatClick = useCallback(
    async (seatId: string) => {
      const isSelected = selectedSeatIds.includes(seatId);

      if (isSelected) {
        setSelectedSeatIds((prev) => prev.filter((id) => id !== seatId));
      } else {
        if (selectedSeatIds.length >= 10) {
          alert('Bạn chỉ có thể chọn tối đa 10 ghế');
          return;
        }

        const newSelection = [...selectedSeatIds, seatId];
        setSelectedSeatIds(newSelection);

        try {
          await holdSeatsMutation.mutateAsync(newSelection);
          // API có thể trả null; giữ chỗ mặc định 10 phút (đồng bộ với server)
          setExpiresAt(new Date(Date.now() + 10 * 60 * 1000));
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : 'Không thể giữ ghế. Vui lòng thử lại.';
          alert(message);
          setSelectedSeatIds((prev) => prev.filter((id) => id !== seatId));
        }
      }
    },
    [selectedSeatIds, holdSeatsMutation]
  );

  const handleFoodQuantityChange = useCallback(
    (productId: string, quantity: number) => {
      setFoodQuantities((prev) => {
        const newMap = new Map(prev);
        if (quantity === 0) {
          newMap.delete(productId);
        } else {
          newMap.set(productId, quantity);
        }
        return newMap;
      });
    },
    []
  );

  const handleContinue = async () => {
    try {
      const foodItemsData = foodItems.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
      }));

      const booking = await createBookingMutation.mutateAsync({
        showtimeId: showtimeId!,
        seats: selectedSeatIds,
        foodItems: foodItemsData.length > 0 ? foodItemsData : undefined,
      });

      navigate(`/booking/${booking._id}/confirm`);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Không thể tạo booking. Vui lòng thử lại.';
      alert(message);
    }
  };

  const handleExpired = () => {
    alert('Hết thời gian giữ chỗ. Vui lòng chọn lại.');
    setSelectedSeatIds([]);
    setExpiresAt(null);
  };

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            border: '3px solid #e5e7eb',
            borderTopColor: HEADER_BG,
            borderRadius: '50%',
            animation: 'spin 0.9s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#eef2f7', color: '#111827' }}>
      {/* Header kiểu Metiz */}
      <header
        style={{
          background: HEADER_BG,
          color: '#fff',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            style={{
              fontWeight: 800,
              fontSize: 22,
              letterSpacing: '0.04em',
              color: GOLD,
            }}
          >
            MiCinema
          </span>
          <span style={{ opacity: 0.85, fontSize: 13 }}>| Đặt vé trực tuyến</span>
        </div>
        <nav style={{ display: 'flex', gap: 20, fontSize: 13, opacity: 0.9 }}>
          <span style={{ cursor: 'default' }}>Lịch chiếu</span>
          <span style={{ cursor: 'default' }}>Phim</span>
          <span style={{ cursor: 'default' }}>Ưu đãi</span>
        </nav>
      </header>

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 16px 100px' }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#152238' }}>
            Chọn ghế ngồi
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: 14, color: '#6b7280' }}>
            Chọn ghế yêu thích — màn hình phía trên, hàng ghế theo chữ cái.
          </p>
        </div>

        <style>{`
          @media (max-width: 960px) {
            [data-booking-layout] {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
        <div
          data-booking-layout
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 340px',
            gap: 20,
            alignItems: 'start',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <SeatMap
              seats={seats}
              selectedSeats={selectedSeatIds}
              onSeatClick={handleSeatClick}
              loading={false}
            />

            <section
              style={{
                background: '#ffffff',
                borderRadius: 8,
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 24px rgba(15, 23, 42, 0.06)',
                padding: 20,
              }}
            >
              <h2
                style={{
                  margin: '0 0 16px',
                  fontSize: 17,
                  fontWeight: 700,
                  color: '#152238',
                  borderBottom: `2px solid ${GOLD}`,
                  paddingBottom: 10,
                }}
              >
                Chọn đồ ăn (tùy chọn)
              </h2>
              <FoodMenu
                selectedItems={foodQuantities}
                onQuantityChange={handleFoodQuantityChange}
              />
            </section>
          </div>

          <BookingSummary
            showtime={showtime ?? undefined}
            selectedSeats={selectedSeats}
            foodItems={foodItems}
            expiresAt={expiresAt || undefined}
            onExpired={handleExpired}
          />
        </div>
      </main>

      {/* Thanh vàng điều hướng giống Metiz */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          background: GOLD_BAR,
          borderTop: '1px solid rgba(0,0,0,0.12)',
          padding: '14px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
          boxShadow: '0 -4px 20px rgba(0,0,0,0.12)',
          zIndex: 50,
        }}
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            background: 'rgba(255,255,255,0.35)',
            border: '1px solid rgba(0,0,0,0.15)',
            color: '#1f2937',
            fontWeight: 700,
            padding: '12px 22px',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 15,
          }}
        >
          ‹ Đổi suất chiếu
        </button>
        <button
          type="button"
          onClick={handleContinue}
          disabled={selectedSeatIds.length === 0 || createBookingMutation.isPending}
          style={{
            background:
              selectedSeatIds.length === 0 ? '#9ca3af' : '#152238',
            color: '#fff',
            fontWeight: 800,
            padding: '12px 28px',
            borderRadius: 6,
            border: 'none',
            cursor:
              selectedSeatIds.length === 0 || createBookingMutation.isPending
                ? 'not-allowed'
                : 'pointer',
            fontSize: 15,
            minWidth: 160,
            boxShadow:
              selectedSeatIds.length === 0
                ? 'none'
                : '0 4px 14px rgba(21, 34, 56, 0.35)',
          }}
        >
          {createBookingMutation.isPending ? 'Đang xử lý…' : 'Tiếp tục ›'}
        </button>
      </div>
    </div>
  );
}
