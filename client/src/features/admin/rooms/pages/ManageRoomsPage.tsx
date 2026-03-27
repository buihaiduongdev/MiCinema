import { useState } from 'react';
import {
  Button,
  TextInput,
  Select,
  Modal,
  NumberInput,
  Badge,
} from '@mantine/core';
import { Plus, Home, ChevronRight, Pencil, LayoutGrid, Power, PowerOff } from 'lucide-react';
import { notifications } from '@mantine/notifications';
import {
  useAdminCinemasForRooms,
  useAdminRooms,
  useCreateRoom,
  useDeactivateRoom,
  useUpdateRoom,
  type AdminRoomRow,
} from '../hooks/useRoomCRUD';
import { EditRoomModal } from '../components/EditRoomModal';
import { RoomSeatConfigModal } from '../components/RoomSeatConfigModal';
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner';
import { ROOM_TYPE } from '@shared/constants/seat-types';
import type { CreateRoomInput } from '@shared/schemas/room.schema';

const ROOM_TYPE_LABELS: Record<string, string> = {
  STANDARD: 'Thường',
  VIP: 'VIP',
  IMAX: 'IMAX',
  '4DX': '4DX',
};

const inputStyles = {
  input: {
    backgroundColor: '#060e20',
    border: 'none',
    color: '#dae2fd',
  },
};

export default function ManageRoomsPage() {
  const [page, setPage] = useState(1);
  const [cinemaFilter, setCinemaFilter] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [cinemaId, setCinemaId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [roomType, setRoomType] = useState<string | null>(ROOM_TYPE.STANDARD);
  const [rows, setRows] = useState<number | string>(10);
  const [cols, setCols] = useState<number | string>(12);
  const [editRoom, setEditRoom] = useState<AdminRoomRow | null>(null);
  const [seatRoomId, setSeatRoomId] = useState<string | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<AdminRoomRow | null>(
    null,
  );

  const limit = 10;
  const { data: cinemas = [], isLoading: cinemasLoading } =
    useAdminCinemasForRooms();
  const { data: roomsPayload, isLoading: roomsLoading } = useAdminRooms({
    page,
    limit,
    cinemaId: cinemaFilter || undefined,
  });

  const createRoom = useCreateRoom();
  const deactivateRoom = useDeactivateRoom();
  const updateRoom = useUpdateRoom();

  const rooms: AdminRoomRow[] = roomsPayload?.data ?? [];
  const pagination = roomsPayload?.pagination;
  const totalPages = Math.max(1, pagination?.totalPages ?? 1);

  const resetForm = () => {
    setCinemaId(null);
    setName('');
    setRoomType(ROOM_TYPE.STANDARD);
    setRows(10);
    setCols(12);
  };

  const handleSubmit = async () => {
    if (!cinemaId?.trim() || !name.trim() || !roomType) {
      notifications.show({
        color: 'red',
        title: 'Thiếu thông tin',
        message: 'Chọn chi nhánh, nhập tên phòng và loại phòng.',
      });
      return;
    }
    const r = Number(rows);
    const c = Number(cols);
    if (!Number.isFinite(r) || !Number.isFinite(c) || r < 1 || c < 1) {
      notifications.show({
        color: 'red',
        title: 'Lỗi',
        message: 'Số hàng và số cột không hợp lệ.',
      });
      return;
    }
    try {
      await createRoom.mutateAsync({
        cinemaId,
        name: name.trim(),
        roomType: roomType as CreateRoomInput['roomType'],
        rows: r,
        cols: c,
      });
      notifications.show({
        color: 'green',
        title: 'Thành công',
        message: 'Đã tạo phòng chiếu.',
      });
      setModalOpen(false);
      resetForm();
    } catch (e: unknown) {
      notifications.show({
        color: 'red',
        title: 'Lỗi',
        message: e instanceof Error ? e.message : 'Không tạo được phòng.',
      });
    }
  };

  const handleActivate = async (r: AdminRoomRow) => {
    try {
      await updateRoom.mutateAsync({ id: r._id, body: { isActive: true } });
      notifications.show({
        color: 'green',
        title: 'Đã kích hoạt',
        message: 'Phòng đã hoạt động trở lại.',
      });
    } catch (e: unknown) {
      notifications.show({
        color: 'red',
        title: 'Lỗi',
        message: e instanceof Error ? e.message : 'Không kích hoạt được.',
      });
    }
  };

  const confirmDeactivate = async () => {
    if (!deactivateTarget) return;
    try {
      await deactivateRoom.mutateAsync(deactivateTarget._id);
      notifications.show({
        color: 'green',
        title: 'Đã vô hiệu hóa',
        message: 'Phòng đã được đánh dấu ngưng hoạt động.',
      });
      setDeactivateTarget(null);
    } catch (e: unknown) {
      notifications.show({
        color: 'red',
        title: 'Lỗi',
        message: e instanceof Error ? e.message : 'Không vô hiệu hóa được.',
      });
    }
  };

  const cinemaLabel = (room: AdminRoomRow) => {
    const cid = room.cinemaId;
    if (cid && typeof cid === 'object' && 'name' in cid) {
      return `${cid.name} (${cid.city})`;
    }
    return '—';
  };

  if (roomsLoading || cinemasLoading) {
    return <LoadingSpinner />;
  }

  const cinemaSelectData = cinemas.map((c) => ({
    value: c._id,
    label: `${c.name} — ${c.city}`,
  }));

  const roomTypeData = [
    { value: ROOM_TYPE.STANDARD, label: ROOM_TYPE_LABELS.STANDARD },
    { value: ROOM_TYPE.VIP, label: ROOM_TYPE_LABELS.VIP },
    { value: ROOM_TYPE.IMAX, label: ROOM_TYPE_LABELS.IMAX },
    { value: ROOM_TYPE.FOUR_DX, label: ROOM_TYPE_LABELS['4DX'] },
  ];

  return (
    <div className="w-full min-w-0">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-6 mb-8">
          <div className="min-w-0">
            <h1 className="text-4xl font-extrabold tracking-tight text-[#dae2fd] mb-2">
              Quản lý phòng chiếu
            </h1>
            <p className="text-[#c2c6d8] flex items-center gap-2 text-sm">
              <Home size={14} />
              <span>Hệ thống</span>
              <ChevronRight size={14} />
              <span className="text-[#b3c5ff]">Phòng chiếu</span>
            </p>
          </div>

          <Button
            onClick={() => setModalOpen(true)}
            leftSection={<Plus size={18} />}
            styles={{
              root: {
                background: '#0066ff',
                color: '#f8f7ff',
                borderRadius: 14,
                paddingInline: 18,
                height: 44,
                fontWeight: 800,
                boxShadow: '0 12px 24px rgba(0,102,255,0.22)',
              },
            }}
          >
            Thêm phòng chiếu
          </Button>
        </div>

        <div className="bg-[#131b2e] p-6 rounded-xl mb-6">
          <Select
            placeholder="Lọc theo chi nhánh"
            clearable
            data={cinemaSelectData}
            value={cinemaFilter}
            onChange={(v) => {
              setCinemaFilter(v);
              setPage(1);
            }}
            styles={{
              input: {
                backgroundColor: '#060e20',
                border: 'none',
                color: '#dae2fd',
                minWidth: 320,
              },
            }}
          />
        </div>

        <div className="bg-[#131b2e] rounded-xl overflow-hidden">
          {rooms.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-[#8c90a1]">Chưa có phòng chiếu nào</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#424656]/40 text-[#8c90a1] text-xs uppercase tracking-wider">
                      <th className="px-4 py-3 font-semibold">Tên phòng</th>
                      <th className="px-4 py-3 font-semibold">Chi nhánh</th>
                      <th className="px-4 py-3 font-semibold">Loại</th>
                      <th className="px-4 py-3 font-semibold">Lưới ghế</th>
                      <th className="px-4 py-3 font-semibold">Trạng thái</th>
                      <th className="px-4 py-3 font-semibold text-right">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map((room) => (
                      <tr
                        key={room._id}
                        className="border-b border-[#424656]/25 hover:bg-[#171f33]/80"
                      >
                        <td className="px-4 py-3 text-[#dae2fd] font-medium">
                          {room.name}
                        </td>
                        <td className="px-4 py-3 text-[#dae2fd]">
                          {cinemaLabel(room)}
                        </td>
                        <td className="px-4 py-3 text-[#dae2fd]">
                          {ROOM_TYPE_LABELS[room.roomType] ?? room.roomType}
                        </td>
                        <td className="px-4 py-3 text-[#dae2fd]">
                          {room.rows} × {room.cols}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            color={room.isActive ? 'blue' : 'gray'}
                            variant="light"
                          >
                            {room.isActive ? 'Hoạt động' : 'Ngưng'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex flex-wrap justify-end gap-1.5">
                            <Button
                              size="xs"
                              variant="light"
                              color="gray"
                              leftSection={<Pencil size={12} />}
                              styles={{
                                root: {
                                  backgroundColor: '#222a3d',
                                  color: '#dae2fd',
                                },
                              }}
                              onClick={() => setEditRoom(room)}
                            >
                              Sửa
                            </Button>
                            <Button
                              size="xs"
                              variant="light"
                              color="gray"
                              leftSection={<LayoutGrid size={12} />}
                              styles={{
                                root: {
                                  backgroundColor: '#222a3d',
                                  color: '#dae2fd',
                                },
                              }}
                              onClick={() => setSeatRoomId(room._id)}
                            >
                              Ghế
                            </Button>
                            {room.isActive ? (
                              <Button
                                size="xs"
                                variant="light"
                                color="red"
                                leftSection={<PowerOff size={12} />}
                                onClick={() => setDeactivateTarget(room)}
                              >
                                Vô hiệu
                              </Button>
                            ) : (
                              <Button
                                size="xs"
                                variant="light"
                                color="teal"
                                leftSection={<Power size={12} />}
                                onClick={() => void handleActivate(room)}
                              >
                                Bật lại
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className="p-4 flex justify-center border-t border-[#424656]/30">
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        type="button"
                        onClick={() => setPage(i + 1)}
                        className={`px-4 py-2 rounded-lg transition-all ${
                          page === i + 1
                            ? 'bg-[#0066ff] text-white font-bold'
                            : 'bg-[#060e20] text-[#8c90a1] hover:text-[#dae2fd]'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Modal
        opened={modalOpen}
        onClose={() => {
          setModalOpen(false);
          resetForm();
        }}
        title="Thêm phòng chiếu"
        size="md"
        styles={{
          content: { backgroundColor: '#131b2e' },
          header: { backgroundColor: '#131b2e', color: '#dae2fd' },
          title: { fontWeight: 'bold', fontSize: '1.25rem' },
        }}
      >
        <div className="space-y-4">
          <Select
            label="Chi nhánh"
            placeholder="Chọn rạp"
            data={cinemaSelectData}
            value={cinemaId}
            onChange={setCinemaId}
            required
            styles={inputStyles}
            labelProps={{ style: { color: '#c2c6d8' } }}
          />
          <TextInput
            label="Tên phòng"
            placeholder="Ví dụ: Phòng 1"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            required
            styles={inputStyles}
            labelProps={{ style: { color: '#c2c6d8' } }}
          />
          <Select
            label="Loại phòng"
            data={roomTypeData}
            value={roomType}
            onChange={setRoomType}
            required
            styles={inputStyles}
            labelProps={{ style: { color: '#c2c6d8' } }}
          />
          <div className="grid grid-cols-2 gap-4">
            <NumberInput
              label="Số hàng"
              min={1}
              max={26}
              value={rows}
              onChange={setRows}
              styles={inputStyles}
              labelProps={{ style: { color: '#c2c6d8' } }}
            />
            <NumberInput
              label="Số cột"
              min={1}
              max={40}
              value={cols}
              onChange={setCols}
              styles={inputStyles}
              labelProps={{ style: { color: '#c2c6d8' } }}
            />
          </div>
          <Button
            fullWidth
            loading={createRoom.isPending}
            onClick={() => void handleSubmit()}
            styles={{
              root: {
                background: '#0066ff',
                fontWeight: 700,
                marginTop: 8,
              },
            }}
          >
            Tạo phòng
          </Button>
        </div>
      </Modal>

      <EditRoomModal
        room={editRoom}
        opened={!!editRoom}
        onClose={() => setEditRoom(null)}
      />

      <RoomSeatConfigModal
        roomId={seatRoomId}
        opened={!!seatRoomId}
        onClose={() => setSeatRoomId(null)}
      />

      <Modal
        opened={!!deactivateTarget}
        onClose={() => setDeactivateTarget(null)}
        title="Vô hiệu hóa phòng chiếu?"
        size="sm"
        styles={{
          content: { backgroundColor: '#131b2e' },
          header: { backgroundColor: '#131b2e', color: '#dae2fd' },
          title: { fontWeight: 'bold', fontSize: '1.1rem' },
        }}
      >
        <p className="text-[#c2c6d8] text-sm mb-4">
          Phòng &quot;{deactivateTarget?.name}&quot; sẽ không dùng cho suất chiếu
          mới. Chỉ thực hiện được khi không còn suất đang mở trong tương lai.
        </p>
        <div className="flex gap-2 justify-end">
          <Button variant="subtle" color="gray" onClick={() => setDeactivateTarget(null)}>
            Hủy
          </Button>
          <Button
            color="red"
            loading={deactivateRoom.isPending}
            onClick={() => void confirmDeactivate()}
          >
            Vô hiệu hóa
          </Button>
        </div>
      </Modal>
    </div>
  );
}
