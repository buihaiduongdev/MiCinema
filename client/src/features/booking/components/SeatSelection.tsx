import { Group, Stack, Text, Box, Divider } from '@mantine/core';
import { notifications } from '@mantine/notifications';
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
  [SEAT_TYPE.NORMAL]: '#2d3748', // Xám đậm
  [SEAT_TYPE.VIP]: '#f59e0b', // Vàng cam
  [SEAT_TYPE.SWEETBOX]: '#e11d48', // Đỏ hồng
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

  const rows = useMemo(() => {
    return seats.reduce<Record<string, SeatConfig[]>>((acc, seat) => {
      if (!acc[seat.row]) acc[seat.row] = [];
      acc[seat.row].push(seat);
      return acc;
    }, {});
  }, [seats]);

  const handleClick = (seat: SeatConfig) => {
    if (!seat.isActive) return;
    const isSelected = selectedSeats.has(seat.seatId);

    if (isSelected) {
      dispatch({ type: 'DESELECT_SEAT', payload: seat.seatId });
    } else {
      if (selectedSeats.size >= maxSeats) {
        notifications.show({
          title: 'Giới hạn số lượng',
          message: `Bạn chỉ có thể chọn tối đa ${maxSeats} ghế cho mỗi lần đặt.`,
          color: 'red',
        });
        return;
      }

      const price = Math.round(ticketPrice * PRICE_MULTIPLIER[seat.type]);
      dispatch({
        type: 'SELECT_SEAT',
        payload: {
          seatId: seat.seatId,
          row: seat.row,
          col: seat.col,
          type: seat.type,
          price,
        },
      });
    }
  };

  return (
    <Stack gap="xl" align="center" w="100%">
      <Box w="80%" maw={600} pos="relative">
        <Box
          h={8}
          bg="blue.4"
          style={{
            borderRadius: '50% 50% 0 0',
            boxShadow: '0 -4px 20px 2px rgba(96, 165, 250, 0.5)',
          }}
        />
        <Text ta="center" mt="xs" fw={700} c="dimmed" size="xs" lts={4}>
          MÀN HÌNH
        </Text>
      </Box>

      {/* Sơ đồ ghế */}
      <Stack gap={8} p="md" style={{ overflowX: 'auto', maxWidth: '100%' }}>
        {Object.entries(rows)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([rowLabel, rowSeats]) => (
            <Group key={rowLabel} gap={6} wrap="nowrap" justify="center">
              <Text w={24} ta="center" size="xs" fw={800} c="yellow.5">
                {rowLabel}
              </Text>

              {rowSeats
                .sort((a, b) => a.col - b.col)
                .map((seat) => {
                  const isBooked = bookedSeatIdsSet.has(seat.seatId);
                  const isSelected = selectedSeats.has(seat.seatId);
                  const isDisabled = isBooked || !seat.isActive;

                  let bgColor = SEAT_COLOR[seat.type];
                  if (isSelected) bgColor = '#e11d48';
                  if (isBooked) bgColor = '#1a1a1a';

                  return (
                    <Box
                      key={seat.seatId}
                      onClick={() => !isDisabled && handleClick(seat)}
                      style={{
                        width: 32,
                        height: 28,
                        backgroundColor: bgColor,
                        borderRadius: '4px 4px 10px 10px',
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '9px',
                        fontWeight: 700,
                        color: isBooked ? '#444' : '#fff',
                        transition: 'all 0.2s ease',
                        border: isSelected
                          ? '2px solid #fff'
                          : '1px solid rgba(255,255,255,0.1)',
                        transform: isSelected ? 'scale(1.1)' : 'none',
                        opacity: isBooked ? 0.5 : 1,
                      }}
                      title={`${seat.seatId} - ${seat.type}`}
                    >
                      {seat.col}
                    </Box>
                  );
                })}

              <Text w={24} ta="center" size="xs" fw={800} c="yellow.5">
                {rowLabel}
              </Text>
            </Group>
          ))}
      </Stack>

      <Divider
        w="100%"
        label="Chú thích"
        labelPosition="center"
        color="gray.8"
      />

      {/* Chú thích ghế */}
      <Group gap="xl" wrap="wrap" justify="center">
        <SeatLegend color="#2d3748" label="Thường" />
        <SeatLegend color="#f59e0b" label="VIP" />
        <SeatLegend color="#e11d48" label="Đang chọn" border="2px solid #fff" />
        <SeatLegend color="#1a1a1a" label="Đã bán" opacity={0.5} />
      </Group>
    </Stack>
  );
}

function SeatLegend({ color, label, border, opacity }: any) {
  return (
    <Group gap={6}>
      <Box
        w={20}
        h={18}
        style={{
          backgroundColor: color,
          borderRadius: '3px 3px 6px 6px',
          border: border || '1px solid rgba(255,255,255,0.1)',
          opacity: opacity || 1,
        }}
      />
      <Text size="xs" fw={500} c="gray.4">
        {label}
      </Text>
    </Group>
  );
}
