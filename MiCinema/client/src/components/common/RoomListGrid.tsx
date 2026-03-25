import { Link } from 'react-router-dom';
import { Armchair, ChevronRight } from 'lucide-react';
import type { IRoom } from '@/features/admin/rooms/hooks/useRoomCRUD';

const ROOM_TYPE_LABEL: Record<string, string> = {
  STANDARD: 'Tiêu chuẩn',
  VIP: 'VIP',
  IMAX: 'IMAX',
  '4DX': '4DX',
};

function roomTypeLabel(type: string) {
  return ROOM_TYPE_LABEL[type] ?? type;
}

function seatCapacity(room: IRoom) {
  if (room.seats?.length) return room.seats.filter((s) => s.isActive !== false).length;
  return room.rows * room.colsPerRow;
}

type Props = {
  rooms: IRoom[];
  maxItems?: number;
  showViewAllTo?: string;
};

export function RoomListGrid({ rooms, maxItems, showViewAllTo = '/rooms' }: Props) {
  const list = maxItems != null ? rooms.slice(0, maxItems) : rooms;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {list.map((room) => (
        <article
          key={room._id ?? room.name}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-5 text-left shadow-lg transition hover:border-yellow-500/35 hover:shadow-yellow-500/5"
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-500/15 text-yellow-400 transition group-hover:bg-yellow-500/25">
                <Armchair className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <h3 className="text-base font-semibold leading-snug text-white md:text-lg">{room.name}</h3>
                <p className="mt-2 text-sm text-slate-400">
                  <span className="font-medium text-slate-200">{seatCapacity(room)}</span> chỗ ngồi
                </p>
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-yellow-500/15 px-2.5 py-1 text-xs font-medium text-yellow-300">
              {roomTypeLabel(room.type)}
            </span>
          </div>
          <p className="border-t border-white/5 pt-3 text-xs text-slate-500">
            Sơ đồ ghế: {room.rows} hàng × {room.colsPerRow} ghế mỗi hàng
          </p>
        </article>
      ))}
      {maxItems != null && rooms.length > maxItems && (
        <Link
          to={showViewAllTo}
          className="group flex min-h-[160px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 bg-slate-800/40 p-6 text-center transition hover:border-yellow-500/40 hover:bg-slate-800/60"
        >
          <span className="flex items-center gap-1 text-sm font-semibold text-yellow-400">
            Xem tất cả phòng
            <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </span>
          <span className="text-xs text-slate-500">Còn {rooms.length - maxItems} phòng khác</span>
        </Link>
      )}
    </div>
  );
}
