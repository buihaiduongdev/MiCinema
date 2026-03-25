import { Link } from 'react-router-dom';
import { Armchair, Building2, Loader2 } from 'lucide-react';
import { useActiveRooms } from '@/features/admin/rooms/hooks/useRoomCRUD';
import { RoomListGrid } from '@/components/common/RoomListGrid';
import { EmptyState } from '@/components/common/EmptyState';

export function RoomsPage() {
  const { data: rooms, isLoading, isError, error } = useActiveRooms();

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 pb-24 pt-8">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="mb-12">
          <nav className="mb-4 flex items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="transition hover:text-yellow-400">
              Trang chủ
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-slate-300">Phòng chiếu</span>
          </nav>
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-500/15 text-yellow-400">
              <Building2 className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">Phòng chiếu</h1>
              <p className="mt-1 max-w-2xl text-slate-400">
                Các phòng đang mở bán vé — thông tin đồng bộ với hệ thống quản lý rạp.
              </p>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500">
            <Loader2 className="h-10 w-10 animate-spin text-yellow-500/80" />
            <p className="mt-4 text-sm">Đang tải danh sách phòng…</p>
          </div>
        )}

        {isError && (
          <EmptyState
            variant="error"
            icon={Armchair}
            title="Không tải được danh sách"
            description={
              error instanceof Error ? error.message : 'Vui lòng thử lại sau hoặc kiểm tra kết nối mạng.'
            }
          >
            <Link
              to="/"
              className="inline-flex rounded-full bg-white/10 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-white/15"
            >
              Về trang chủ
            </Link>
          </EmptyState>
        )}

        {!isLoading && !isError && rooms && rooms.length === 0 && (
          <EmptyState
            icon={Armchair}
            title="Chưa có phòng hiển thị"
            description="Khi rạp thêm phòng chiếu trong hệ thống quản trị, danh sách sẽ xuất hiện tại đây."
          >
            <Link
              to="/admin/rooms"
              className="inline-flex rounded-full bg-yellow-500 px-6 py-2.5 text-sm font-bold text-black transition hover:bg-yellow-400"
            >
              Quản lý phòng (admin)
            </Link>
          </EmptyState>
        )}

        {!isLoading && !isError && rooms && rooms.length > 0 && <RoomListGrid rooms={rooms} />}
      </div>
    </div>
  );
}
