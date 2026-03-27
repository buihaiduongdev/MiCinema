import { Group, Text, RingProgress, Center, Stack, Paper } from '@mantine/core';
import { Hourglass } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

type Props = {
  expiresAt?: string | Date;
  duration?: number;
  onExpire: () => void;
};

export function BookingTimer({ duration = 600, onExpire, expiresAt }: Props) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  });

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (expiresAt) {
      // CHẾ ĐỘ 1: Đếm ngược theo mốc thời gian cố định (Dành cho trang Thanh toán)
      const targetTime = new Date(expiresAt).getTime();

      const updateTimer = () => {
        const now = Date.now();
        const diff = Math.floor((targetTime - now) / 1000);

        if (diff <= 0) {
          setTimeLeft(0);
          onExpireRef.current();
        } else {
          setTimeLeft(diff);
          timerId = setTimeout(updateTimer, 1000);
        }
      };

      updateTimer();
    } else {
      // CHẾ ĐỘ 2: Đếm ngược theo thời lượng (Dành cho trang Chọn ghế)
      timerId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerId);
            onExpireRef.current();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerId) {
        clearTimeout(timerId);
        clearInterval(timerId);
      }
    };
  }, [expiresAt, duration]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isUrgent = timeLeft < 60;
  const percentage = (timeLeft / (expiresAt ? 600 : duration)) * 100;

  return (
    <Paper
      p="xs"
      radius="md"
      bg="rgba(225, 29, 72, 0.1)"
      style={{ border: '1px solid rgba(225, 29, 72, 0.2)' }}
    >
      <Group gap="sm" wrap="nowrap">
        <RingProgress
          size={45}
          thickness={4}
          roundCaps
          sections={[
            { value: percentage, color: isUrgent ? 'red.6' : 'yellow.6' },
          ]}
          label={
            <Center>
              <Hourglass size={16} color={isUrgent ? '#e11d48' : '#fab005'} />
            </Center>
          }
        />
        <Stack gap={0}>
          <Text size="xs" fw={700} c="gray.5" lts={1}>
            GIỮ GHẾ TRONG
          </Text>
          <Text
            size="md"
            fw={800}
            c={isUrgent ? 'red.6' : 'white'}
            ff="monospace"
          >
            {String(minutes).padStart(2, '0')}:
            {String(seconds).padStart(2, '0')}
          </Text>
        </Stack>
      </Group>
    </Paper>
  );
}
