import {
  Stack,
  Text,
  Paper,
  Title,
  Loader,
  Image,
  Group,
  Divider,
} from '@mantine/core';
import { useState, useEffect } from 'react';
import { usePayment } from '../hooks/usePayment';
import { useNavigate } from 'react-router-dom';

type Props = {
  bookingId: string;
  totalPrice: number;
};

export function PaymentForm({ bookingId, totalPrice }: Props) {
  const [qrUrl, setQrUrl] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate();
  const { mutate: pay } = usePayment();

  useEffect(() => {
    if (bookingId) {
      pay(bookingId, {
        onSuccess: (res) => {
          setQrUrl(res.data.paymentUrl);

          setTimeout(() => {
            setIsRedirecting(true);
            setTimeout(() => {
              navigate(`/booking/result/${bookingId}`);
            }, 2000);
          }, 2000);
        },
      });
    }
  }, [bookingId]);

  return (
    <Paper
      p="xl"
      radius="lg"
      bg="#0f172a"
      ta="center"
      style={{ border: '2px solid #e11d48', color: 'white', minHeight: 400 }}
    >
      <Stack align="center" gap="xl" h="100%" justify="center">
        {!qrUrl ? (
          <Stack align="center">
            <Loader color="yellow" size="xl" />
            <Text c="gray.4" fw={700}>
              ĐANG TẠO MÃ THANH TOÁN...
            </Text>
          </Stack>
        ) : (
          <>
            <Title order={3} c="white" style={{ letterSpacing: '1px' }}>
              QUÉT MÃ VIETQR ĐỂ XÁC NHẬN
            </Title>

            <Paper
              p="sm"
              bg="white"
              radius="md"
              style={{ boxShadow: '0 0 30px rgba(225, 29, 72, 0.3)' }}
            >
              <Image src={qrUrl} w={300} alt="VietQR" />
            </Paper>

            <Stack gap="xs">
              <Group gap="xs" justify="center">
                <Text size="xl" fw={800} c="yellow.5">
                  {totalPrice.toLocaleString('vi-VN')}₫
                </Text>
              </Group>

              {isRedirecting ? (
                <Group gap="xs" justify="center">
                  <Loader color="green" size="xs" />
                  <Text c="green.4" fw={700}>
                    ĐÃ NHẬN THANH TOÁN!
                  </Text>
                </Group>
              ) : (
                <Text
                  c="gray.5"
                  size="sm"
                  fw={600}
                  style={{ fontStyle: 'italic' }}
                >
                  Vui lòng quét mã trên ứng dụng ngân hàng của bạn
                </Text>
              )}
            </Stack>

            <Divider
              w="100%"
              color="gray.8"
              style={{ borderStyle: 'dashed' }}
            />

            <Text size="xs" c="gray.6">
              Hệ thống sẽ tự động chuyển hướng sau khi giao dịch hoàn tất.
            </Text>
          </>
        )}
      </Stack>
    </Paper>
  );
}
