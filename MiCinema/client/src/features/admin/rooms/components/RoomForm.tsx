import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';
import type { IRoom } from '../hooks/useRoomCRUD';

const roomSchema = z.object({
  name: z.string().min(1, 'Tên phòng không được để trống'),
  rows: z.number().int().min(1).max(20),
  colsPerRow: z.number().int().min(1).max(20),
  type: z.string().min(1, 'Loại phòng không được để trống'),
  isActive: z.boolean(),
});

interface RoomFormProps {
  room?: IRoom;
  onSubmit: (data: Omit<IRoom, '_id'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function RoomForm({ room, onSubmit, onCancel, isLoading }: RoomFormProps) {
  const form = useForm({
    defaultValues: {
      name: room?.name || '',
      rows: room?.rows || 8,
      colsPerRow: room?.colsPerRow || 12,
      type: room?.type || 'STANDARD',
      isActive: room?.isActive ?? true,
    },
    onSubmit: async ({ value }) => {
      const seats = generateSeats(value.rows, value.colsPerRow);
      onSubmit({ ...value, seats });
    },
    validatorAdapter: zodValidator(),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-4 bg-gray-800 p-6 rounded-lg"
    >
      <h2 className="text-xl font-bold text-white mb-4">
        {room ? 'Chỉnh sửa phòng' : 'Tạo phòng mới'}
      </h2>

      <form.Field
        name="name"
        validators={{
          onChange: roomSchema.shape.name,
        }}
      >
        {(field) => (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Tên phòng
            </label>
            <input
              type="text"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Phòng 1"
            />
            {field.state.meta.errors && (
              <p className="text-red-500 text-sm mt-1">
                {field.state.meta.errors.join(', ')}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <div className="grid grid-cols-2 gap-4">
        <form.Field
          name="rows"
          validators={{
            onChange: roomSchema.shape.rows,
          }}
        >
          {(field) => (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Số hàng
              </label>
              <input
                type="number"
                value={field.state.value}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="20"
              />
            </div>
          )}
        </form.Field>

        <form.Field
          name="colsPerRow"
          validators={{
            onChange: roomSchema.shape.colsPerRow,
          }}
        >
          {(field) => (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Số ghế/hàng
              </label>
              <input
                type="number"
                value={field.state.value}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="20"
              />
            </div>
          )}
        </form.Field>
      </div>

      <form.Field
        name="type"
        validators={{
          onChange: roomSchema.shape.type,
        }}
      >
        {(field) => (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Loại phòng
            </label>
            <select
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="STANDARD">Thường</option>
              <option value="VIP">VIP</option>
              <option value="IMAX">IMAX</option>
            </select>
          </div>
        )}
      </form.Field>

      <form.Field name="isActive">
        {(field) => (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={field.state.value}
              onChange={(e) => field.handleChange(e.target.checked)}
              className="w-5 h-5"
            />
            <label className="text-sm text-gray-300">Phòng hoạt động</label>
          </div>
        )}
      </form.Field>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 rounded-lg transition"
        >
          {isLoading ? 'Đang lưu...' : 'Lưu'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition"
        >
          Hủy
        </button>
      </div>
    </form>
  );
}

function generateSeats(rows: number, colsPerRow: number) {
  const seats = [];
  const rowLabels = 'ABCDEFGHIJKLMNOPQRST';

  for (let r = 0; r < rows; r++) {
    for (let c = 1; c <= colsPerRow; c++) {
      seats.push({
        row: rowLabels[r],
        col: c,
        type: 'NORMAL' as const,
        isActive: true,
      });
    }
  }

  return seats;
}
