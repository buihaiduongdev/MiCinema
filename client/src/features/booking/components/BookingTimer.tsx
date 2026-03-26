import { useEffect, useRef, useState } from 'react';
import { Group, Text, RingProgress, ThemeIcon } from '@mantine/core';

type Props = {
  durationSeconds?: number;
  onExpire: () => void;
};

export function BookingTimer({ durationSeconds = 600, onExpire }: Props) {
  const [remaining, setRemaining] = useState(durationSeconds);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (remaining <= 0) {
      onExpireRef.current();
      return;
    }

    const interval = setInterval(() => {
      setRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [remaining]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const percent = (remaining / durationSeconds) * 100;
  const isUrgent = remaining <= 60;

  return (
    <Group gap="xs" justify="center">
      <RingProgress
        size={48}
        thickness={4}
        roundCaps
        sections={[{ value: percent, color: isUrgent ? 'red' : 'teal' }]}
        label={
          <ThemeIcon
            color={isUrgent ? 'red' : 'teal'}
            variant="light"
            radius="xl"
            size="sm"
          ></ThemeIcon>
        }
      />
      <Text fw={700} c={isUrgent ? 'red' : 'teal'} size="lg">
        {timeStr}
      </Text>
      <Text size="xs" c="dimmed">
        Thời gian giữ ghế còn lại
      </Text>
    </Group>
  );
}
