import { Group, Button, Stack, Text, Badge, Paper, Title } from '@mantine/core';
import type { SeatConfig, SeatSelection } from '@shared/index';
import { SEAT_TYPE, PRICE_MULTIPLIER } from '@shared/index';
import type React from 'react';
import { useMemo } from 'react';

type Props = {
  seats: SeatConfig[];
  bookedSeatIds: string[];
  ticketPrice: number;
  selectedSeats: Map<string, SeatSelection>;
  maxSeats: number;
  dispatch: React.Dispatch<
    | { type: 'SELECT_SEAT'; payload: SeatSelection }
    | { type: 'DESELECT_SEAT'; payload: string }
  >;
};

const SEAT_COLOR: Record<string, string> = {
  [SEAT_TYPE.NORMAL]: 'teal',
  [SEAT_TYPE.VIP]: 'yellow',
  [SEAT_TYPE.SWEETBOX]: 'pink',
};

export function SeatSelection({
  seats,
  bookedSeatIds,
  ticketPrice,
  selectedSeats,
  maxSeats,
  dispatch,
}: Props) {
  const bookedSeatIdsSet = useMemo(
    () => new Set(bookedSeatIds),
    [bookedSeatIds],
  );
  const rows = seats.reduce<Record<string, SeatConfig[]>>((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {});

  const handleClick = (seat: SeatConfig) => {
    if (!seat.isActive) return;

    const isSelected = selectedSeats.has(seat.seatId);

    if (isSelected) {
      dispatch({ type: 'DESELECT_SEAT', payload: seat.seatId });
    } else {
      const price = Math.round(ticketPrice * PRICE_MULTIPLIER[seat.type]);
      dispatch({
        type: 'SELECT_SEAT',
        payload: { ...seat, price: price },
      });
    }
  };
  return (
    <Stack gap="xl">
      {/* Màn hình */}
      <Paper
        bg="dark.7"
        p="xs"
        w="100%"
        radius="xs"
        style={{ borderTop: '4px solid red' }}
      >
        <Title order={4} ta="center" c="dimmed">
          MÀN HÌNH CHÍNH
        </Title>
      </Paper>
      {/* Sơ đồ ghế theo hàng */}
      <Stack gap="xs" align="center">
        {Object.entries(rows)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([rowLabel, rowSeats]) => (
            <Group key={rowLabel} gap={6} wrap="nowrap">
              <Text w={20} ta="center" size="xs" c="dimmed" fw={700}>
                {rowLabel}
              </Text>
              {rowSeats
                .sort((a, b) => a.col - b.col)
                .map((seat) => {
                  const isBooked = bookedSeatIdsSet.has(seat.seatId);
                  const isSelected = selectedSeats.has(seat.seatId);
                  const isDisabled =
                    isBooked ||
                    !seat.isActive ||
                    (!isSelected && selectedSeats.size >= maxSeats);
                  return (
                    <Button
                      key={seat.seatId}
                      size="compact-sm"
                      w={36}
                      h={36}
                      p={0}
                      radius="sm"
                      variant={isSelected ? 'filled' : 'outline'}
                      color={
                        isBooked || !seat.isActive
                          ? 'gray'
                          : isSelected
                            ? 'red'
                            : SEAT_COLOR[seat.type]
                      }
                      disabled={isDisabled}
                      onClick={() => handleClick(seat)}
                      styles={{ label: { fontSize: '9px' } }}
                      title={`${seat.seatId} — ${seat.type}`}
                    >
                      {seat.col}
                    </Button>
                  );
                })}
            </Group>
          ))}
      </Stack>
      <Group mt="sm" gap="md" justify="center">
        <Badge color="teal" variant="dot">
          Thường
        </Badge>
        <Badge color="yellow" variant="dot">
          VIP
        </Badge>
        <Badge color="pink" variant="dot">
          Sweetbox
        </Badge>
        <Badge color="red" variant="filled">
          Đang chọn
        </Badge>
        <Badge color="gray" variant="filled">
          Đã đặt
        </Badge>
      </Group>
    </Stack>
  );
}
