/**
 * OccupancyChart — Biểu đồ tỷ lệ lấp đầy
 *
 * Dùng: CSS charts
 * Data: % ghế đã bán theo phòng hoặc theo suất chiếu
 */

import {
  Card,
  Select,
  Group,
  Text,
  Stack,
  Progress,
  Badge,
} from '@mantine/core';
import { useState } from 'react';
import {
  useOccupancyByRoom,
  useOccupancyByShowtime,
} from '../hooks/useStatistics';
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner';

/**
 * OccupancyChart — Thống kê tỷ lệ lấp đầy ghế (UC-35)
 */

export default function OccupancyChart() {
  const [viewType, setViewType] = useState<'room' | 'showtime'>('room');

  const { data: roomData, isLoading: isLoadingRoom } = useOccupancyByRoom();
  const { data: showtimeData, isLoading: isLoadingShowtime } =
    useOccupancyByShowtime();

  const isLoading = viewType === 'room' ? isLoadingRoom : isLoadingShowtime;
  const data =
    viewType === 'room' ? roomData?.data || [] : showtimeData?.data || [];

  if (isLoading) return <LoadingSpinner />;

  const getOccupancyColor = (percentage: number) => {
    if (percentage < 30) return 'red';
    if (percentage < 60) return 'yellow';
    if (percentage < 80) return 'blue';
    return 'green';
  };

  const getOccupancyLabel = (percentage: number) => {
    if (percentage < 30) return 'Thấp';
    if (percentage < 60) return 'Trung bình';
    if (percentage < 80) return 'Cao';
    return 'Rất cao';
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between">
          <div>
            <Text fw={700} size="lg">
              Tỷ lệ lấp đầy
            </Text>
            <Text size="sm" c="dimmed">
              {viewType === 'room' ? 'Theo phòng chiếu' : 'Theo suất chiếu'}
            </Text>
          </div>
          <Select
            data={[
              { value: 'room', label: 'Theo phòng' },
              { value: 'showtime', label: 'Theo suất chiếu' },
            ]}
            value={viewType}
            onChange={(val) => setViewType((val as any) || 'room')}
            w={150}
          />
        </Group>

        {data.length > 0 ? (
          <div className="space-y-4">
            {data.map((item: any, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-center">
                  <Text size="sm" fw={500}>
                    {item.roomName || `Suất chiếu ${idx + 1}`}
                  </Text>
                  <Badge
                    size="sm"
                    color={getOccupancyColor(item.occupancyRate)}
                    variant="light"
                  >
                    {getOccupancyLabel(item.occupancyRate)}
                  </Badge>
                </div>
                <Progress
                  value={item.occupancyRate}
                  color={getOccupancyColor(item.occupancyRate)}
                  size="md"
                  radius="md"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{item.occupancyRate.toFixed(1)}%</span>
                  <span>
                    {item.seatsBooked}/{item.totalSeats} ghế
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Text c="dimmed" ta="center" py="xl">
            Không có dữ liệu
          </Text>
        )}
      </Stack>
    </Card>
  );
}
