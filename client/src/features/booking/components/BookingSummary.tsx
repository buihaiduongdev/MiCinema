import {
  Paper,
  Stack,
  Title,
  Text,
  Group,
  Divider,
  Badge,
  Button,
  Image,
  Box,
  Center,
} from '@mantine/core';
import type {
  SeatSelection,
  ShowtimeType,
  RoomType,
  MovieType,
} from '@shared/index';
import { SEAT_TYPE } from '@shared/index';

type Props = {
  showtime: ShowtimeType & { roomId: RoomType };
  selectedSeats: Map<string, SeatSelection>;
  totalPrice: number;
  isPending: boolean;
  onConfirm: () => void;
  isConfirm: boolean;
};

const SEAT_LABEL: Record<string, string> = {
  [SEAT_TYPE.NORMAL]: 'Thường',
  [SEAT_TYPE.VIP]: 'VIP',
  [SEAT_TYPE.SWEETBOX]: 'Sweetbox',
};

export function BookingSummary({
  showtime,
  selectedSeats,
  totalPrice,
  isPending,
  onConfirm,
  isConfirm = false,
}: Props) {
  const seats = Array.from(selectedSeats.values());
  const movie = showtime.movieId as unknown as MovieType;

  return (
    <Paper
      shadow="xl"
      p="xl"
      radius="lg"
      bg="rgba(15, 23, 42, 0.8)"
      style={{
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(12px)',
        color: 'white',
      }}
    >
      <Stack gap="md">
        {/* Movie Info with Title */}
        <Group align="flex-start" wrap="nowrap">
          <Image
            src={movie?.poster}
            w={80}
            radius="md"
            fallbackSrc="https://placehold.co/80x120?text=No+Poster"
          />
          <Stack gap={4}>
            <Title order={4} c="white">
              {movie?.title}
            </Title>
            <Badge color="yellow" variant="outline" size="xs">
              {movie?.ageRating}
            </Badge>
          </Stack>
        </Group>

        <Divider color="gray.8" />

        {/* Showtime Info */}
        <Stack gap={4}>
          <Text size="sm" fw={700} c="yellow.5">
            {showtime.roomId.name}
          </Text>
          <Text size="xs" c="gray.4">
            {new Date(showtime.startTime).toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
            {' • '}
            {new Date(showtime.startTime).toLocaleDateString('vi-VN', {
              weekday: 'long',
              day: '2-digit',
              month: '2-digit',
            })}
          </Text>
        </Stack>

        <Divider color="gray.8" variant="dashed" />

        {/* Selected Seats List */}
        <Box mih={100}>
          <Text size="xs" mb="xs" c="gray.5" fw={700} lts={1}>
            GHẾ ĐÃ CHỌN
          </Text>
          {seats.length === 0 ? (
            <Center h={60}>
              <Text size="xs" c="dimmed" fs="italic">
                Vui lòng chọn ghế trên sơ đồ
              </Text>
            </Center>
          ) : (
            <Stack gap={8}>
              {seats.map((seat) => (
                <Group key={seat.seatId} justify="space-between">
                  <Group gap={6}>
                    <Box
                      w={12}
                      h={12}
                      style={{
                        backgroundColor:
                          seat.type === SEAT_TYPE.VIP
                            ? '#f59e0b'
                            : seat.type === SEAT_TYPE.SWEETBOX
                              ? '#e11d48'
                              : '#4b5563',
                        borderRadius: '2px',
                      }}
                    />
                    <Text size="sm" fw={600}>
                      {seat.seatId} ({SEAT_LABEL[seat.type]})
                    </Text>
                  </Group>
                  <Text size="sm" fw={700}>
                    {seat.price.toLocaleString('vi-VN')}₫
                  </Text>
                </Group>
              ))}
            </Stack>
          )}
        </Box>

        <Divider color="gray.8" />

        {/* Total Price */}
        <Group justify="space-between">
          <Text size="sm" fw={700}>
            TẠM TÍNH
          </Text>
          <Title order={3} c="yellow.5">
            {totalPrice.toLocaleString('vi-VN')}₫
          </Title>
        </Group>

        {!isConfirm && (
          <Button
            fullWidth
            size="lg"
            radius="md"
            color="red.7"
            variant="filled"
            disabled={seats.length === 0}
            loading={isPending}
            onClick={onConfirm}
            style={{
              boxShadow:
                seats.length > 0 ? '0 8px 15px rgba(225, 29, 72, 0.3)' : 'none',
            }}
          >
            TIẾP TỤC ĐẶT VÉ
          </Button>
        )}
      </Stack>
    </Paper>
  );
}
