import { useState, useMemo } from 'react';
import { useUpdateSeat, type ISeat, type IRoom } from '../hooks/useRoomCRUD';
import { cn } from '@/utils/cn';

interface RoomSeatConfigProps {
  room: IRoom;
}

export function RoomSeatConfig({ room }: RoomSeatConfigProps) {
  const updateSeatMutation = useUpdateSeat(room._id!);
  const [selectedSeat, setSelectedSeat] = useState<ISeat | null>(null);

  const seatsByRow = useMemo(() => {
    const grouped = room.seats.reduce(
      (acc, seat) => {
        if (!acc[seat.row]) {
          acc[seat.row] = [];
        }
        acc[seat.row].push(seat);
        return acc;
      },
      {} as Record<string, ISeat[]>
    );

    Object.keys(grouped).forEach((row) => {
      grouped[row].sort((a, b) => a.col - b.col);
    });

    return grouped;
  }, [room.seats]);

  const rows = useMemo(() => {
    return Object.keys(seatsByRow).sort();
  }, [seatsByRow]);

  const handleSeatClick = (seat: ISeat) => {
    setSelectedSeat(seat);
  };

  const handleUpdateSeat = async (
    seat: ISeat,
    updates: Partial<ISeat>
  ) => {
    try {
      const seatId = `${seat.row}${seat.col}`;
      await updateSeatMutation.mutateAsync({ seatId, data: updates });
      setSelectedSeat(null);
    } catch (error: any) {
      alert(error.message || 'Không thể cập nhật ghế');
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-bold text-white mb-4">Cấu hình ghế</h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="text-center mb-4">
              <div className="h-2 bg-gradient-to-b from-gray-400 to-gray-700 rounded-[50%_50%_0_0/20%_20%_0_0] mb-2" />
              <p className="text-gray-400 text-sm">Màn hình</p>
            </div>

            <div className="flex flex-col gap-2">
              {rows.map((row) => (
                <div key={row} className="flex items-center gap-2">
                  <div className="w-8 text-center text-gray-400 font-semibold">
                    {row}
                  </div>

                  <div className="flex gap-1 flex-1 justify-center">
                    {seatsByRow[row].map((seat) => (
                      <button
                        key={`${seat.row}${seat.col}`}
                        onClick={() => handleSeatClick(seat)}
                        className={cn(
                          'w-8 h-8 rounded-t-md text-xs flex items-center justify-center transition',
                          {
                            'bg-blue-500': seat.type === 'NORMAL' && seat.isActive,
                            'bg-orange-400': seat.type === 'VIP' && seat.isActive,
                            'bg-red-400': seat.type === 'SWEETBOX' && seat.isActive,
                            'bg-gray-600 opacity-50': !seat.isActive,
                            'ring-2 ring-white':
                              selectedSeat &&
                              selectedSeat.row === seat.row &&
                              selectedSeat.col === seat.col,
                          }
                        )}
                      >
                        <span className="text-white">{seat.col}</span>
                      </button>
                    ))}
                  </div>

                  <div className="w-8" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          {selectedSeat ? (
            <div className="bg-gray-700 rounded-lg p-4 space-y-4">
              <h4 className="font-bold text-white">
                Ghế {selectedSeat.row}
                {selectedSeat.col}
              </h4>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Loại ghế
                </label>
                <select
                  value={selectedSeat.type}
                  onChange={(e) =>
                    handleUpdateSeat(selectedSeat, {
                      type: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded"
                >
                  <option value="NORMAL">Thường</option>
                  <option value="VIP">VIP</option>
                  <option value="SWEETBOX">Đôi</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedSeat.isActive}
                  onChange={(e) =>
                    handleUpdateSeat(selectedSeat, {
                      isActive: e.target.checked,
                    })
                  }
                  className="w-5 h-5"
                />
                <label className="text-sm text-gray-300">Hoạt động</label>
              </div>

              <button
                onClick={() => setSelectedSeat(null)}
                className="w-full bg-gray-600 hover:bg-gray-500 text-white py-2 rounded"
              >
                Đóng
              </button>
            </div>
          ) : (
            <div className="bg-gray-700 rounded-lg p-4 text-center text-gray-400">
              Chọn một ghế để cấu hình
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 rounded-t-md" />
          <span className="text-sm text-gray-300">Thường</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-orange-400 rounded-t-md" />
          <span className="text-sm text-gray-300">VIP</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-400 rounded-t-md" />
          <span className="text-sm text-gray-300">Đôi</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-600 opacity-50 rounded-t-md" />
          <span className="text-sm text-gray-300">Tắt</span>
        </div>
      </div>
    </div>
  );
}
