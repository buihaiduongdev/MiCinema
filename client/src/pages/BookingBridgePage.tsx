import { Link } from 'react-router-dom';
import { Calendar, Film, Ticket } from 'lucide-react';
import { defaultBookingPath, hasDefaultShowtime } from '@/constants/booking';
import { EmptyState } from '@/components/common/EmptyState';

type Props = {
  title: string;
  description: string;
  /** Phân biệt icon theo route */
  variant?: 'movies' | 'schedule';
};

/**
 * Trang chuyển tiếp: /movies, /schedule khi chưa có danh sách từ API.
 */
export function BookingBridgePage({ title, description, variant = 'movies' }: Props) {
  const bookTo = defaultBookingPath();
  const Icon = variant === 'schedule' ? Calendar : Film;

  return (
    <div className="mx-auto max-w-xl px-4 py-12 md:py-20">
      <EmptyState
        icon={Icon}
        title={title}
        description={description}
      >
        {bookTo ? (
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to={bookTo}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-yellow-500 px-8 py-3.5 text-base font-bold text-black shadow-lg shadow-yellow-500/20 transition hover:bg-yellow-400 sm:w-auto"
            >
              <Ticket className="h-5 w-5" strokeWidth={2} />
              Đặt vé ngay
            </Link>
            <Link
              to="/"
              className="inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-3 text-base font-medium text-white transition hover:bg-white/10 sm:w-auto"
            >
              Về trang chủ
            </Link>
          </div>
        ) : (
          <>
            <p className="max-w-md text-sm text-slate-400">
              Hiện chưa thể mở màn đặt vé trực tiếp từ đây. Bạn vẫn có thể xem phòng chiếu hoặc quay lại trang chủ — phần lịch chiếu đầy đủ sẽ được cập nhật sớm.
            </p>
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/rooms"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Xem phòng chiếu
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-full bg-yellow-500 px-6 py-3 text-sm font-bold text-black transition hover:bg-yellow-400"
              >
                Về trang chủ
              </Link>
            </div>
            <details className="mt-4 w-full max-w-md text-left text-xs text-slate-500">
              <summary className="cursor-pointer select-none text-slate-500 hover:text-slate-400">
                Gợi ý cho quản trị / lập trình
              </summary>
              <p className="mt-2 rounded-lg border border-white/5 bg-slate-950/50 p-3 leading-relaxed">
                Để nút &quot;Đặt vé ngay&quot; hoạt động, thêm biến môi trường{' '}
                <span className="font-mono text-slate-400">VITE_DEFAULT_SHOWTIME_ID</span> (ObjectId suất
                chiếu) vào file <span className="font-mono text-slate-400">.env</span> của client và khởi động
                lại dev server.
              </p>
            </details>
          </>
        )}
      </EmptyState>

      {hasDefaultShowtime() && (
        <p className="mt-8 text-center text-xs text-slate-600">
          Suất đặt vé dùng cấu hình mặc định trên hệ thống.
        </p>
      )}
    </div>
  );
}
