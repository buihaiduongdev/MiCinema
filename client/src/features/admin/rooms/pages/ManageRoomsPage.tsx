import { useState } from 'react';
import { RoomForm } from '../components/RoomForm';
import { RoomSeatConfig } from '../components/RoomSeatConfig';
import {
  useRooms,
  useCreateRoom,
  useUpdateRoom,
  useDeleteRoom,
  type IRoom,
} from '../hooks/useRoomCRUD';

export function ManageRoomsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<IRoom | null>(null);
  const [configRoom, setConfigRoom] = useState<IRoom | null>(null);

  const { data: rooms, isLoading } = useRooms();
  const createMutation = useCreateRoom();
  const updateMutation = useUpdateRoom(editingRoom?._id || '');
  const deleteMutation = useDeleteRoom();

  const handleCreate = async (data: Omit<IRoom, '_id'>) => {
    try {
      await createMutation.mutateAsync(data);
      setShowForm(false);
    } catch (error: any) {
      alert(error.message || 'Không thể tạo phòng');
    }
  };

  const handleUpdate = async (data: Omit<IRoom, '_id'>) => {
    try {
      await updateMutation.mutateAsync(data);
      setEditingRoom(null);
    } catch (error: any) {
      alert(error.message || 'Không thể cập nhật phòng');
    }
  };

  const handleDelete = async (roomId: string) => {
    if (!confirm('Bạn có chắc muốn xóa phòng này?')) return;

    try {
      await deleteMutation.mutateAsync(roomId);
    } catch (error: any) {
      alert(error.message || 'Không thể xóa phòng');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (configRoom) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">
              Cấu hình: {configRoom.name}
            </h1>
            <button
              onClick={() => setConfigRoom(null)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              ← Quay lại
            </button>
          </div>

          <RoomSeatConfig room={configRoom} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Quản lý phòng chiếu</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            + Tạo phòng mới
          </button>
        </div>

        {(showForm || editingRoom) && (
          <div className="mb-6">
            <RoomForm
              room={editingRoom || undefined}
              onSubmit={editingRoom ? handleUpdate : handleCreate}
              onCancel={() => {
                setShowForm(false);
                setEditingRoom(null);
              }}
              isLoading={
                createMutation.isPending || updateMutation.isPending
              }
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms?.map((room) => (
            <div
              key={room._id}
              className="bg-gray-800 rounded-lg p-6 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold">{room.name}</h3>
                  <p className="text-sm text-gray-400">{room.type}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    room.isActive
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {room.isActive ? 'Hoạt động' : 'Tắt'}
                </span>
              </div>

              <div className="text-sm text-gray-300">
                <p>Hàng: {room.rows}</p>
                <p>Ghế/hàng: {room.colsPerRow}</p>
                <p>Tổng ghế: {room.seats.length}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setConfigRoom(room)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm"
                >
                  Cấu hình ghế
                </button>
                <button
                  onClick={() => setEditingRoom(room)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg text-sm"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(room._id!)}
                  disabled={deleteMutation.isPending}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>

        {rooms?.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            Chưa có phòng chiếu nào. Tạo phòng mới để bắt đầu.
          </div>
        )}
      </div>
    </div>
  );
}
