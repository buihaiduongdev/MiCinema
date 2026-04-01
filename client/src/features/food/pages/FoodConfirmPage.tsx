import {
  Container,
  Stack,
  Title,
  Text,
  Paper,
  Image,
  Loader,
  Box,
  Divider,
} from '@mantine/core';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '@/lib/api-client';

export default function FoodConfirmPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [qrUrl, setQrUrl] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (orderId) {
      apiClient.post(`/food/orders/${orderId}/pay`).then((res) => {
        setQrUrl(res.data.paymentUrl);

        // Giả lập nhận thanh toán sau 3 giây
        setTimeout(() => {
          apiClient.patch(`/food/orders/${orderId}/simulate-paid`).then(() => {
            setIsDone(true);
            // Quay về trang Store sau 2 giây nữa
            setTimeout(() => navigate('/order/food'), 2000);
          });
        }, 3000);
      });
    }
  }, [orderId, navigate]);

  return (
    <Box bg="slate.950" mih="100vh" py="xl">
      <Container size="xs">
        <Paper
          p="xl"
          radius="lg"
          bg="#0f172a"
          ta="center"
          style={{ border: '2px solid #e11d48', color: 'white' }}
        >
          <Stack align="center" gap="xl">
            <Title order={2} c="white" style={{ letterSpacing: '1px' }}>
              XÁC NHẬN THANH TOÁN
            </Title>

            {!qrUrl ? (
              <Stack align="center" py="xl">
                <Loader color="yellow" size="lg" />
                <Text c="gray.4">ĐANG TẠO MÃ QR...</Text>
              </Stack>
            ) : (
              <Stack align="center">
                <Paper
                  p="sm"
                  bg="white"
                  radius="md"
                  style={{ boxShadow: '0 0 20px rgba(225, 29, 72, 0.2)' }}
                >
                  <Image src={qrUrl} w={250} alt="VietQR" />
                </Paper>

                {isDone ? (
                  <Stack gap={0} mt="md">
                    <Text c="green.4" fw={900} size="xl">
                      ĐÃ NHẬN THANH TOÁN!
                    </Text>
                    <Text size="xs" c="gray.5">
                      Đơn hàng của bạn đã được ghi nhận
                    </Text>
                  </Stack>
                ) : (
                  <Text c="gray.4" size="sm" mt="md" fw={600}>
                    Vui lòng quét mã trên ứng dụng ngân hàng
                  </Text>
                )}
              </Stack>
            )}

            <Divider
              w="100%"
              color="gray.8"
              style={{ borderStyle: 'dashed' }}
            />
            <Text size="xs" c="gray.6">
              Hệ thống sẽ tự động quay lại cửa hàng sau khi hoàn tất giao dịch.
            </Text>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
