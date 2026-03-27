import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Title,
  Text,
  Loader,
  Center,
  Box,
  Breadcrumbs,
  Anchor,
} from '@mantine/core';
import { useBookingDetail } from '../hooks/useBooking';
import { PaymentForm } from '../components/PaymentForm';
import { BookingSummary } from '../components/BookingSummary';
import type { ShowtimeType, RoomType } from '@shared/index';
import { notifications } from '@mantine/notifications';
import { BookingTimer } from '../components/BookingTimer';

export default function BookingConfirmPage() {
  const { bookingId } = useParams();
  const { data: booking, isLoading } = useBookingDetail(bookingId!);
  const navigate = useNavigate();
  if (isLoading || !booking) {
    return (
      <Center h="70vh" bg="#020617">
        <Loader color="yellow" size="xl" />
      </Center>
    );
  }
  const handleExpire = () => {
    notifications.show({
      title: 'Đơn hàng đã hết hạn',
      message: 'Bạn đã quá thời gian thanh toán, vui lòng đặt lại vé!',
      color: 'red',
    });
    navigate('/phim');
  };
  return (
    <Box bg="slate.950" mih="100vh" py="xl">
      <Container size="xl">
        <Breadcrumbs mb="xl">
          <Anchor component={Link} to="/" c="gray.5">
            TRANG CHỦ
          </Anchor>
          <Text size="xs" c="yellow.5" fw={700}>
            THANH TOÁN
          </Text>
        </Breadcrumbs>

        <Title order={2} c="white" mb="xl">
          Xác nhận đơn hàng
        </Title>
        <Box w={200} mb="xl">
          <BookingTimer
            expiresAt={
              new Date(new Date(booking.createdAt).getTime() + 10 * 60 * 1000)
            }
            onExpire={handleExpire}
          />
        </Box>
        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 7 }}>
            <PaymentForm
              bookingId={booking._id}
              totalPrice={booking.totalPrice}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 5 }}>
            <BookingSummary
              showtime={
                booking.showtimeId as unknown as ShowtimeType & {
                  roomId: RoomType;
                }
              }
              selectedSeats={new Map(booking.seats.map((s) => [s.seatId, s]))}
              totalPrice={booking.totalPrice}
              isPending={false}
              onConfirm={() => {}}
              isConfirm={true}
            />
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}
