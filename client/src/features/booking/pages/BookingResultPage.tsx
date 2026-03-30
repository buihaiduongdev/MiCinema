import {
  Container,
  Center,
  Loader,
  Stack,
  Title,
  Text,
  Button,
  Paper,
  Box,
} from '@mantine/core';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useBookingDetail } from '../hooks/useBooking';
import { TicketResult } from '../components/TicketResult';
import { IconChevronLeft, IconMoodSad } from '@tabler/icons-react';

export default function BookingResultPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const { data: booking, isLoading, isError } = useBookingDetail(bookingId!);

  if (isLoading) {
    return (
      <Center h="100vh" bg="#020617">
        <Stack align="center" gap="md">
          <Loader color="red.7" size="xl" type="bars" />
          <Text c="gray.4" fw={700} lts={1}>
            ĐANG XÁC THỰC VÉ...
          </Text>
        </Stack>
      </Center>
    );
  }

  if (isError || !booking) {
    return (
      <Center h="100vh" bg="#020617">
        <Paper
          p={50}
          radius="xl"
          bg="rgba(15, 23, 42, 0.8)"
          style={{ border: '1px solid rgba(255,255,255,0.1)' }}
          ta="center"
        >
          <Stack align="center" gap="xl">
            <IconMoodSad size={80} color="#64748b" />
            <Box>
              <Title order={2} c="white" mb="xs">
                Rất tiếc!
              </Title>
              <Text c="gray.5">
                Không tìm thấy thông tin đơn hàng này hoặc đơn đã bị hủy.
              </Text>
            </Box>
            <Button
              component={Link}
              to="/"
              variant="white"
              leftSection={<IconChevronLeft size={18} />}
            >
              Quay lại trang chủ
            </Button>
          </Stack>
        </Paper>
      </Center>
    );
  }

  return (
    <Box bg="#020617" mih="100vh" py={60}>
      <Container size="sm">
        <Stack gap={40}>
          <Stack gap={5} ta="center">
            <Title order={1} c="white" style={{ fontSize: 32 }}>
              Thanh toán thành công!
            </Title>
            <Text c="green.4" fw={700}>
              Mã đặt vé của bạn đã được xác nhận
            </Text>
          </Stack>

          <TicketResult booking={booking} />

          <Center mt="xl">
            <Button
              variant="subtle"
              color="gray.5"
              onClick={() => navigate('/')}
              leftSection={<IconChevronLeft size={18} />}
            >
              Về Trang Chủ
            </Button>
          </Center>
        </Stack>
      </Container>
    </Box>
  );
}
