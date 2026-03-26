import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import {
  Container,
  Grid,
  Button,
  Text,
  Stack,
  Paper,
  Group,
  Title,
  Loader,
  Center,
  Breadcrumbs,
  Anchor,
  Divider,
  Badge,
} from '@mantine/core';
import { useSeatMap } from '../hooks/useSeatMap';
import { useCreateBooking } from '../hooks/useBooking';
import {
  type SeatSelection,
  // type MovieType,
  // type CinemaRoomType,
} from '@shared/index';
const BookingPage = () => {
  const { showtimeId } = useParams();
  const { data, isLoading } = useSeatMap(showtimeId!);
  const { mutate: createBooking, isPending } = useCreateBooking();
  const [selectedSeats, setSelectedSeats] = useState<SeatSelection[]>([]);

  if (isLoading || !data?.showtime) {
    return (
      <Center style={{ height: '70vh' }}>
        <Stack align="center">
          <Loader color="red" size="xl" type="bars" />
          <Text fw={500}>Đang chuẩn bị sơ đồ ghế...</Text>
        </Stack>
      </Center>
    );
  }
  const room = data.showtime.roomId as any;
  const seats = room.seats || [];

  const handleToggleSeat = (seat: any) => {
    const isSelected = selectedSeats.some((s) => s.seatId === seat.seatId);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((s) => s.seatId !== seat.seatId));
    } else {
      setSelectedSeats([
        ...selectedSeats,
        {
          seatId: seat.seatId,
          row: seat.row,
          col: seat.col,
          type: seat.type,
          price:
            seat.type === 'VIP'
              ? (data?.showtime.ticketPrice || 0) + 20000
              : data?.showtime.ticketPrice || 0,
        },
      ]);
    }
  };

  const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  return (
    <Container size="lg" py="xl">
      <Breadcrumbs mb="xl">
        <Anchor component={Link} to="/">
          Trang chủ
        </Anchor>
        <Anchor component={Link} to="/movies">
          Phim
        </Anchor>
        <Text c="dimmed">Đặt vé</Text>
      </Breadcrumbs>

      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Paper p="xl" withBorder radius="md">
            <Stack align="center" gap="xl">
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

              {/* Dùng Flex hoặc SimpleGrid sẽ dễ kiểm soát hàng ghế hơn Grid.Col content */}
              <Group gap="xs" justify="center">
                {seats.map((seat: any) => {
                  const isBooked = data.bookedSeatIds.includes(seat.seatId);
                  const isSelected = selectedSeats.some(
                    (s) => s.seatId === seat.seatId,
                  );
                  const isVIP = seat.type === 'VIP';

                  return (
                    <Button
                      key={seat.seatId}
                      variant={isSelected ? 'filled' : 'outline'}
                      color={
                        isBooked
                          ? 'gray'
                          : isSelected
                            ? 'red'
                            : isVIP
                              ? 'yellow'
                              : 'teal'
                      }
                      disabled={isBooked}
                      onClick={() => handleToggleSeat(seat)}
                      size="compact-sm"
                      w={40}
                      h={40}
                      p={0}
                      styles={{ label: { fontSize: '10px' } }}
                    >
                      {seat.seatId}
                    </Button>
                  );
                })}
              </Group>

              <Group mt="xl" gap="xl">
                <Badge color="teal" variant="dot">
                  Thường
                </Badge>
                <Badge color="yellow" variant="dot">
                  VIP
                </Badge>
                <Badge color="red" variant="filled">
                  Đang chọn
                </Badge>
                <Badge color="gray" variant="filled">
                  Đã đặt
                </Badge>
              </Group>
            </Stack>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper
            shadow="md"
            p="xl"
            withBorder
            radius="md"
            style={{ position: 'sticky', top: 20 }}
          >
            <Title order={3} mb="xs">
              {/* {data?.showtime.movieId.title} */}
            </Title>
            <Text size="sm" c="dimmed" mb="md">
              {data?.showtime.roomId.name} •{' '}
              {new Date(data?.showtime.startTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>

            <Divider my="md" variant="dashed" />

            <Group justify="space-between" mb="xs">
              <Text fw={500}>Ghế đã chọn:</Text>
              <Text c="red" fw={700}>
                {selectedSeats.length > 0
                  ? selectedSeats.map((s) => s.seatId).join(', ')
                  : 'Chưa chọn'}
              </Text>
            </Group>

            <Group justify="space-between" mb="xl">
              <Title order={3}>Tổng tiền:</Title>
              <Title order={2} c="red">
                {totalPrice.toLocaleString()}đ
              </Title>
            </Group>

            <Button
              fullWidth
              size="lg"
              radius="md"
              color="red"
              loading={isPending}
              disabled={selectedSeats.length === 0}
              onClick={() =>
                createBooking({ showtimeId: showtimeId!, seats: selectedSeats })
              }
            >
              TIẾP TỤC ĐẶT VÉ
            </Button>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default BookingPage;
