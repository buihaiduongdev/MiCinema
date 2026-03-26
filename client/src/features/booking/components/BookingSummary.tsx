import {
  Paper,
  Stack,
  Title,
  Text,
  Group,
  Divider,
  Badge,
  Button,
} from '@mantine/core';
import type { SeatSelection, ShowtimeType, RoomType } from '@shared/index';
import { SEAT_TYPE } from '@shared/index';
type Props = {
  showtime: ShowtimeType & { roomId: RoomType };
  selectedSeats: Map<string, SeatSelection>;
  totalPrice: number;
  isPending: boolean;
  onConfirm: () => void;
};
const SEAT_LABEL: Record<string, string> = {
  [SEAT_TYPE.NORMAL]: 'Thường',
  [SEAT_TYPE.VIP]: 'VIP',
  [SEAT_TYPE.SWEETBOX]: 'Sweetbox',
};

const SEAT_COLOR: Record<string, string> = {
  [SEAT_TYPE.NORMAL]: 'teal',
  [SEAT_TYPE.VIP]: 'yellow',
  [SEAT_TYPE.SWEETBOX]: 'pink',
};
export function BookingSummary({
  showtime,
  selectedSeats,
  totalPrice,
  isPending,
  onConfirm,
}: Props) {
  const seats = Array.from(selectedSeats.values());

  const startTime = new Date(showtime.startTime);
  const timeStr = startTime.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const dateStr = startTime.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  return (
    <Paper shadow="md" p="xl" withBorder radius="md">
      <Title order={3} mb="xs">
        Thông tin đặt vé
      </Title>
      <Text size="sm" c="dimmed">
        {showtime.roomId.name} • {timeStr}
      </Text>
      <Text size="xs" c="dimmed" mb="md">
        {dateStr}
      </Text>
      <Divider my="md" variant="dashed" />
      {/* Danh sách ghế */}
      <Stack gap="xs" mb="md">
        {seats.length === 0 ? (
          <Text c="dimmed" size="sm" ta="center">
            Chưa chọn ghế nào
          </Text>
        ) : (
          seats.map((seat) => (
            <Group key={seat.seatId} justify="space-between">
              <Group gap="xs">
                <Badge color={SEAT_COLOR[seat.type]} variant="light" size="sm">
                  {SEAT_LABEL[seat.type]}
                </Badge>
                <Text size="sm" fw={500}>
                  Ghế {seat.seatId}
                </Text>
              </Group>
              <Text size="sm">{seat.price.toLocaleString('vi-VN')}đ</Text>
            </Group>
          ))
        )}
      </Stack>
      <Divider my="md" />
      {/* Tổng tiền */}
      <Group justify="space-between" mb="xl">
        <Title order={4}>Tổng tiền</Title>
        <Title order={3} c="red">
          {totalPrice.toLocaleString('vi-VN')}đ
        </Title>
      </Group>
      <Button
        fullWidth
        size="lg"
        radius="md"
        color="red"
        loading={isPending}
        disabled={seats.length === 0}
        onClick={onConfirm}
      >
        TIẾP TỤC ĐẶT VÉ
      </Button>
    </Paper>
  );
}
