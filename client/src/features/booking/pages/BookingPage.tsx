import { useParams, Link, useNavigate } from 'react-router-dom';
import { useReducer } from 'react';
import {
  Container,
  Grid,
  Text,
  Stack,
  Loader,
  Center,
  Breadcrumbs,
  Anchor,
  Paper,
  Box,
  Group,
  Title,
} from '@mantine/core';
import { useSeatMap } from '../hooks/useSeatMap';
import { useCreateBooking } from '../hooks/useBooking';
import { seatReducer, initialSeatState } from '../reducers/seatReducer';
import { SeatSelection } from '../components/SeatSelection';
import { BookingSummary } from '../components/BookingSummary';
import { BookingTimer } from '../components/BookingTimer';
import type { RoomType, MovieType } from '@shared/index';
import { notifications } from '@mantine/notifications';

const BookingPage = () => {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useSeatMap(showtimeId!);
  const { mutate: createBooking, isPending } = useCreateBooking();
  const [state, dispatch] = useReducer(seatReducer, initialSeatState);

  if (isLoading || !data?.showtime) {
    return (
      <Center style={{ height: '70vh', backgroundColor: '#020617' }}>
        <Stack align="center">
          <Loader color="yellow" size="xl" type="bars" />
          <Text fw={500} c="gray.4">
            Hệ thống đang tải sơ đồ ghế...
          </Text>
        </Stack>
      </Center>
    );
  }

  const room = data.showtime.roomId as unknown as RoomType;
  const seats = room.seats ?? [];

  const handleConfirm = () => {
    createBooking(
      {
        showtimeId: showtimeId!,
        seats: Array.from(state.selectedSeats.values()),
      },
      {
        onSuccess: (res) => {
          navigate(`/booking/confirm/${res.data._id}`);
        },
      },
    );
  };

  return (
    <Box bg="slate.950" mih="100vh" py="xl">
      <Container size="xl">
        {/* Header Section */}
        <Group justify="space-between" mb="xl" align="flex-end">
          <Stack gap={4}>
            <Breadcrumbs c="gray.5">
              <Anchor component={Link} to="/" c="gray.5">
                TRANG CHỦ
              </Anchor>
              <Text size="xs" c="yellow.5" fw={700}>
                ĐẶT VÉ
              </Text>
            </Breadcrumbs>
            <Title order={2} c="white" lts={1}>
              {(data.showtime.movieId as unknown as MovieType).title}
            </Title>
            <Group gap="xs" c="gray.4">
              <Text size="sm" fw={700}>
                {data.showtime.roomId.name}
              </Text>
              <Text size="sm">•</Text>
              <Text size="sm">
                {new Date(data.showtime.startTime).toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
              <Text size="sm">•</Text>
              <Text size="sm">
                {new Date(data.showtime.startTime).toLocaleDateString('vi-VN')}
              </Text>
            </Group>
          </Stack>

          <Box w={200}>
            <BookingTimer
              onExpire={() => {
                dispatch({ type: 'RESET' });
                notifications.show({
                  title: 'Hết thời gian giữ chỗ',
                  message: 'Phiên làm việc đã kết thúc, vui lòng chọn lại ghế!',
                  color: 'red',
                });
              }}
            />
          </Box>
        </Group>

        <Grid gutter="xl">
          {/* Sơ đồ ghế */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Paper
              p="xl"
              radius="lg"
              bg="rgba(15, 23, 42, 0.6)"
              style={{
                border: '1px solid rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <SeatSelection
                seats={seats}
                bookedSeatIds={data.bookedSeatIds}
                ticketPrice={data.showtime.ticketPrice}
                selectedSeats={state.selectedSeats}
                maxSeats={state.maxSeats}
                dispatch={dispatch}
              />
            </Paper>
          </Grid.Col>

          {/* Sidebar Summary */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Box style={{ position: 'sticky', top: 20 }}>
              <BookingSummary
                showtime={data.showtime}
                selectedSeats={state.selectedSeats}
                totalPrice={state.totalPrice}
                isPending={isPending}
                onConfirm={handleConfirm}
                isConfirm={false}
              />
            </Box>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
};

export default BookingPage;
