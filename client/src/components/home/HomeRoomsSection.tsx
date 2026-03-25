import { Link } from 'react-router-dom';
import { Armchair, Loader2 } from 'lucide-react';
import { useActiveRooms } from '@/features/admin/rooms/hooks/useRoomCRUD';
import { RoomListGrid } from '@/components/common/RoomListGrid';
import { defaultBookingPath } from '@/constants/booking';
import { EmptyState } from '@/components/common/EmptyState';

export function HomeRoomsSection() {
  const { data: rooms, isLoading, isError, error } = useActiveRooms();
  const bookHref = defaultBookingPath() ?? '/schedule';

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">Phòng chiếu</h2>
          <p className="mt-2 max-w-xl text-slate-400">
            Hạ tầng phòng tại MiCinema — luôn cập nhật theo hệ thống quản lý rạp.
          </p>
          <p className="mt-3 text-sm text-slate-500">
            <Link to={bookHref} className="font-medium text-yellow-500/95 hover:text-yellow-400">
              Đặt vé xem phim
            </Link>
            <span className="mx-2 text-slate-600">·</span>
            <Link to="/schedule" className="hover:text-slate-300">
              Lịch chiếu
            </Link>
          </p>
        </div>
        <Link
          to="/rooms"
          className="inline-flex items-center gap-1 text-sm font-semibold text-yellow-400 transition hover:text-yellow-300"
        >
          Xem tất cả
          <span aria-hidden>→</span>
        </Link>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center gap-3 py-12 text-slate-500">
          <Loader2 className="h-8 w-8 animate-spin text-yellow-500/70" />
          <span className="text-sm">Đang tải…</span>
        </div>
      )}

      {isError && (
        <EmptyState
          variant="error"
          icon={Armchair}
          title="Không tải được phòng chiếu"
          description={error instanceof Error ? error.message : 'Thử tải lại trang sau vài giây.'}
        >
          <Link
            to="/rooms"
            className="text-sm font-medium text-yellow-400 hover:underline"
          >
            Thử mở trang Phòng chiếu
          </Link>
        </EmptyState>
      )}

      {!isLoading && !isError && rooms && rooms.length === 0 && (
        <EmptyState
          icon={Armchair}
          title="Chưa có phòng"
          description="Danh sách sẽ hiển thị khi đã cấu hình phòng trong hệ thống."
        >
          <Link
            to="/admin/rooms"
            className="text-sm font-medium text-yellow-400 hover:underline"
          >
            Quản trị phòng
          </Link>
        </EmptyState>
      )}

      {!isLoading && !isError && rooms && rooms.length > 0 && (
        <RoomListGrid rooms={rooms} maxItems={4} showViewAllTo="/rooms" />
      )}
    </section>
  );
}
