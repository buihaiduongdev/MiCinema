import {
  Button,
  Stack,
  Text,
  Paper,
  Title,
  Divider,
  Group,
  Radio,
} from '@mantine/core';
import { useState } from 'react';
import { usePayment } from '../hooks/usePayment';

type Props = {
  bookingId: string;
  totalPrice: number;
};

export function PaymentForm({ bookingId, totalPrice }: Props) {
  const [method, setMethod] = useState('ATM');
  const { mutate: pay, isPending } = usePayment();

  return (
    <Paper
      p="xl"
      radius="lg"
      bg="rgba(15, 23, 42, 0.8)"
      style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
    >
      <Title order={3} mb="md" c="white">
        Hình thức thanh toán
      </Title>

      <Radio.Group value={method} onChange={setMethod}>
        <Stack gap="md">
          <Paper p="sm" withBorder bg="transparent" radius="md">
            <Radio
              value="ATM"
              label="Thẻ ATM / Internet Banking"
              color="yellow"
            />
          </Paper>
          <Paper p="sm" withBorder bg="transparent" radius="md">
            <Radio value="MOMO" label="Ví điện tử MoMo" color="yellow" />
          </Paper>
        </Stack>
      </Radio.Group>

      <Divider my="xl" color="gray.8" />

      <Group justify="space-between" mb="xl">
        <Text size="lg" fw={700}>
          SỐ TIỀN CẦN THANH TOÁN
        </Text>
        <Title order={2} c="yellow.5">
          {totalPrice.toLocaleString('vi-VN')}₫
        </Title>
      </Group>

      <Button
        fullWidth
        size="lg"
        color="red.7"
        loading={isPending}
        onClick={() => pay(bookingId)}
      >
        THANH TOÁN NGAY
      </Button>

      <Text size="xs" ta="center" mt="md" c="gray.5">
        Bằng việc bấm thanh toán, bạn đồng ý với các Điều khoản của MiCinema.
      </Text>
    </Paper>
  );
}
