import { useParams, useNavigate } from 'react-router-dom';
import { useBooking } from '../hooks/useBooking';

export function BookingSuccessPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const { data: booking, isLoading } = useBooking(bookingId!);

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

  const showtime =
    typeof booking.showtimeId !== 'string' ? booking.showtimeId : undefined;

  const room =
    showtime && typeof showtime.roomId !== 'string'
      ? showtime.roomId
      : undefined;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-gray-800 rounded-lg p-8 text-center space-y-6">
        <div className="text-6xl">✅</div>
        <h1 className="text-3xl font-bold text-green-400">
          Đặt vé thành công!
        </h1>

        <div className="bg-gray-700 rounded-lg p-6 space-y-4 text-left">
          <div>
            <p className="text-gray-400 text-sm">Mã đặt vé</p>
            <p className="text-2xl font-bold font-mono text-blue-400">
              {booking.bookingCode}
            </p>
          </div>

          {movie && (
            <div>
              <p className="text-gray-400 text-sm">Phim</p>
              <p className="font-semibold text-lg">{movie.title}</p>
            </div>
          )}

          {showtime && (
            <>
              <div className="flex gap-6">
                <div>
                  <p className="text-gray-400 text-sm">Ngày chiếu</p>
                  <p className="font-semibold">
                    {new Date(showtime.startTime).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Giờ chiếu</p>
                  <p className="font-semibold">
                    {new Date(showtime.startTime).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              {room && (
                <div>
                  <p className="text-gray-400 text-sm">Phòng</p>
                  <p className="font-semibold">{room.name}</p>
                </div>
              )}
            </>
          )}

          <div>
            <p className="text-gray-400 text-sm">Ghế</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {booking.items.map((item) => (
                <span
                  key={item.seatId}
                  className="px-3 py-1 bg-blue-600 text-white rounded"
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
                  <div key={index} className="flex justify-between">
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

          <div className="border-t border-gray-600 pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Tổng tiền:</span>
              <span className="text-green-400">
                {booking.totalAmount.toLocaleString('vi-VN')}đ
              </span>
            </div>
          </div>

          {booking.paymentMethod && (
            <div>
              <p className="text-gray-400 text-sm">Phương thức thanh toán</p>
              <p className="font-semibold">{booking.paymentMethod}</p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <p className="text-gray-400 text-sm">
            Vui lòng đến quầy trước giờ chiếu 15 phút để nhận vé
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition"
            >
              Về trang chủ
            </button>
            <button
              onClick={() => navigate('/bookings')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
            >
              Xem vé của tôi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
