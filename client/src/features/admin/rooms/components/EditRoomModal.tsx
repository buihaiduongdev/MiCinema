import { useEffect, useState } from 'react';
import { Button, Modal, Select, Switch, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { ROOM_TYPE } from '@shared/constants/seat-types';
import type { CreateRoomInput } from '@shared/schemas/room.schema';
import { useUpdateRoom, type AdminRoomRow } from '../hooks/useRoomCRUD';

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

type Props = {
  room: AdminRoomRow | null;
  opened: boolean;
  onClose: () => void;
};

export function EditRoomModal({ room, opened, onClose }: Props) {
  const [name, setName] = useState('');
  const [roomType, setRoomType] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);
  const updateRoom = useUpdateRoom();

  useEffect(() => {
    if (room && opened) {
      setName(room.name);
      setRoomType(room.roomType);
      setIsActive(room.isActive);
    }
  }, [room, opened]);

  const handleSave = async () => {
    if (!room || !name.trim() || !roomType) {
      notifications.show({
        color: 'red',
        title: 'Thiếu thông tin',
        message: 'Nhập tên phòng và chọn loại phòng.',
      });
      return;
    }
    try {
      await updateRoom.mutateAsync({
        id: room._id,
        body: {
          name: name.trim(),
          roomType: roomType as CreateRoomInput['roomType'],
          isActive,
        },
      });
      notifications.show({
        color: 'green',
        title: 'Đã lưu',
        message: 'Cập nhật phòng chiếu thành công.',
      });
      onClose();
    } catch (e: unknown) {
      notifications.show({
        color: 'red',
        title: 'Lỗi',
        message: e instanceof Error ? e.message : 'Không cập nhật được.',
      });
    }
  };

  const roomTypeData = [
    { value: ROOM_TYPE.STANDARD, label: ROOM_TYPE_LABELS.STANDARD },
    { value: ROOM_TYPE.VIP, label: ROOM_TYPE_LABELS.VIP },
    { value: ROOM_TYPE.IMAX, label: ROOM_TYPE_LABELS.IMAX },
    { value: ROOM_TYPE.FOUR_DX, label: ROOM_TYPE_LABELS['4DX'] },
  ];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Sửa phòng chiếu"
      size="md"
      styles={{
        content: { backgroundColor: '#131b2e' },
        header: { backgroundColor: '#131b2e', color: '#dae2fd' },
        title: { fontWeight: 'bold', fontSize: '1.25rem' },
      }}
    >
      <div className="space-y-4">
        <TextInput
          label="Tên phòng"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          styles={inputStyles}
          labelProps={{ style: { color: '#c2c6d8' } }}
        />
        <Select
          label="Loại phòng"
          data={roomTypeData}
          value={roomType}
          onChange={setRoomType}
          styles={inputStyles}
          labelProps={{ style: { color: '#c2c6d8' } }}
        />
        <Switch
          label="Phòng đang hoạt động"
          checked={isActive}
          onChange={(e) => setIsActive(e.currentTarget.checked)}
          styles={{ label: { color: '#c2c6d8' } }}
        />
        <p className="text-xs text-[#8c90a1]">
          Tắt hoạt động khi không còn suất chiếu mở trong tương lai. Cấu hình ghế
          dùng nút &quot;Ghế&quot; trên danh sách.
        </p>
        <Button
          fullWidth
          loading={updateRoom.isPending}
          onClick={() => void handleSave()}
          styles={{
            root: { background: '#0066ff', fontWeight: 700 },
          }}
        >
          Lưu thay đổi
        </Button>
      </div>
    </Modal>
  );
}
