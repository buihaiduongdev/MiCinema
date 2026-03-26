import { useParams, Link } from 'react-router-dom';
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
} from '@mantine/core';
import { useSeatMap } from '../hooks/useSeatMap';
import { useCreateBooking } from '../hooks/useBooking';
import { seatReducer, initialSeatState } from '../reducers/seatReducer';
import { SeatSelection } from '../components/SeatSelection';
import { BookingSummary } from '../components/BookingSummary';
import { BookingTimer } from '../components/BookingTimer';
import type { RoomType } from '@shared/index';

const BookingPage = () => {
  const { showtimeId } = useParams();
  // const navigate = useNavigate();
  const { data, isLoading } = useSeatMap(showtimeId!);
  const { mutate: createBooking, isPending } = useCreateBooking();
  const [state, dispatch] = useReducer(seatReducer, initialSeatState);

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

  const room = data.showtime.roomId as unknown as RoomType;
  const seats = room.seats ?? [];

  const handleConfirm = () => {
    createBooking(
      {
        showtimeId: showtimeId!,
        seats: Array.from(state.selectedSeats.values()),
      },
      {
        onSuccess: () => {
          // navigate(`/booking/confirm/${res.data.}`);
        },
      },
    );
  };

  const handleExpire = () => {
    dispatch({ type: 'RESET' });
  };

  return (
    <Container size="lg" py="xl">
      <Breadcrumbs mb="xl">
        <Anchor component={Link} to="/">
          Trang chủ
        </Anchor>
        <Anchor component={Link} to="/phim">
          Phim
        </Anchor>
        <Text c="dimmed">Đặt vé</Text>
      </Breadcrumbs>

      {/* Timer */}
      <Paper withBorder p="sm" mb="xl" radius="md">
        <BookingTimer onExpire={handleExpire} />
      </Paper>

      <Grid gutter="xl">
        {/* Sơ đồ ghế */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Paper p="xl" withBorder radius="md">
            <SeatSelection
              seats={seats}
              bookedSeatIds={data.bookedSeatIds}
              ticketPrice={data.showtime.ticketPrice}
              selectedSeats={state.selectedSeats}
              maxSeats={initialSeatState.maxSeats}
              dispatch={dispatch}
            />
          </Paper>
        </Grid.Col>

        {/* Tóm tắt đơn */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <BookingSummary
            showtime={data.showtime}
            selectedSeats={state.selectedSeats}
            totalPrice={state.totalPrice}
            isPending={isPending}
            onConfirm={handleConfirm}
          />
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default BookingPage;
