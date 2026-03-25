import { useParams, useNavigate } from 'react-router-dom';
import { PaymentForm } from '../components/PaymentForm';
import { BookingTimer } from '../components/BookingTimer';
import { useBooking, useConfirmBooking } from '../hooks/useBooking';
import type { PaymentFormData } from '../schemas/booking.schema';

export function BookingConfirmPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const { data: booking, isLoading } = useBooking(bookingId!);
  const confirmMutation = useConfirmBooking(bookingId!);

  const handlePaymentSubmit = async (data: PaymentFormData) => {
    try {
      await confirmMutation.mutateAsync(data);
      navigate(`/booking/${bookingId}/success`);
    } catch (error: any) {
      alert(error.message || 'Không thể xác nhận thanh toán. Vui lòng thử lại.');
    }
  };

  const handleExpired = () => {
    alert('Hết thời gian thanh toán. Booking đã bị hủy.');
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Không tìm thấy booking
          </h2>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  const movie =
    typeof booking.showtimeId !== 'string' &&
    typeof booking.showtimeId.movieId !== 'string'
      ? booking.showtimeId.movieId
      : undefined;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Xác nhận thanh toán</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-bold">Thông tin đặt vé</h2>

            {movie && (
              <div>
                <p className="text-gray-400 text-sm">Phim</p>
                <p className="font-semibold">{movie.title}</p>
              </div>
            )}

            <div>
              <p className="text-gray-400 text-sm">Mã đặt vé</p>
              <p className="font-semibold font-mono">{booking.bookingCode}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Ghế đã chọn</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {booking.items.map((item) => (
                  <span
                    key={item.seatId}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                  >
                    {item.row}
                    {item.col}
                  </span>
                ))}
              </div>
            </div>

            {booking.foodOrders && booking.foodOrders.length > 0 && (
              <div>
                <p className="text-gray-400 text-sm">Đồ ăn</p>
                <div className="mt-1 space-y-1">
                  {booking.foodOrders.map((food, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-sm"
                    >
                      <span>
                        {food.name} × {food.quantity}
                      </span>
                      <span>
                        {(food.price * food.quantity).toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-gray-700 pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Tổng cộng:</span>
                <span className="text-blue-400">
                  {booking.totalAmount.toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>

            <BookingTimer
              expiresAt={booking.seatHoldExpiry}
              onExpired={handleExpired}
            />
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">Phương thức thanh toán</h2>
            <PaymentForm
              onSubmit={handlePaymentSubmit}
              isLoading={confirmMutation.isPending}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
