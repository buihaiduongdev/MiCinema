import {
  Container,
  Grid,
  Title,
  Text,
  Stack,
  Group,
  Box,
  Select,
} from '@mantine/core';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FoodMenu from '../components/FoodMenu';
import FoodCart from '../components/FoodCart';
import { useOrderFood } from '../hooks/useOrderFood';
import { useMyBookings } from '../../booking/hooks/useBooking';

export default function FoodMenuPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<Record<string, number>>({});
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );

  const { data: bookingsData } = useMyBookings({ page: 1, limit: 10 });
  const { mutate: createOrder, isPending } = useOrderFood();

  const bookingOptions = (bookingsData?.bookings || [])
    .filter((b) => b.status === 'PENDING' || b.status === 'PAID')
    .map((b: any) => ({
      value: b._id,
      label: `Vé: ${b.showtimeId?.movieId?.title || 'Phim'} - Ghế: ${b.seats.map((s: any) => s.seatId).join(', ')}`,
    }));

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const handleCheckout = () => {
    if (!selectedBookingId) {
      alert('Vui lòng chọn một mã vé để gắn đồ ăn!');
      return;
    }

    const items = Object.entries(cart)
      .filter(([, qty]) => qty > 0)
      .map(([productId, quantity]) => ({ productId, quantity }));

    createOrder(
      {
        bookingId: selectedBookingId,
        items,
      },
      {
        onSuccess: (res) => {
          setCart({});
          navigate(`/order/food/confirm/${res.data._id}`);
        },
      },
    );
  };

  return (
    <Box bg="slate.950" mih="100vh" py="xl">
      <Container size="xl">
        <Stack gap="xl">
          <Group justify="space-between" align="flex-end">
            <Stack gap={0}>
              <Title order={1} c="white" lts={1}>
                CỬA HÀNG BẮP NƯỚC
              </Title>
              <Text c="gray.5">
                Chọn món ngon để buổi xem phim thêm trọn vẹn
              </Text>
            </Stack>

            <Select
              label="Chọn vé để nhận đồ ăn"
              placeholder="Chọn mã đặt vé của bạn"
              data={bookingOptions}
              value={selectedBookingId}
              onChange={setSelectedBookingId}
              w={350}
              styles={{
                label: { color: 'white', marginBottom: 5 },
                input: {
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.1)',
                },
              }}
            />
          </Group>

          <Grid gutter="xl">
            <Grid.Col span={{ base: 12, md: 8 }}>
              <FoodMenu cart={cart} onUpdateQuantity={handleUpdateQuantity} />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <FoodCart
                cart={cart}
                onClear={() => setCart({})}
                onCheckout={handleCheckout}
                isPending={isPending}
              />
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
