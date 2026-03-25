/**
 * StatCards — Cards thống kê tổng quan
 *
 * Hiển thị: 4-6 cards (tổng doanh thu, số vé bán, số phim, số suất chiếu)
 * Dùng: useStatistics() hook
 */

import { SimpleGrid, Card, Text, Group } from '@mantine/core';
import { TrendingUp, Users, Film, Clock } from 'lucide-react';
import { useDashboardOverview } from '../hooks/useStatistics';
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner';

/**
 * StatCards — Thẻ hiển thị chỉ số chính trang dashboard (UC-33)
 * Tổng doanh thu, số vé bán, số phim, số suất chiếu
 */

export default function StatCards() {
    const { data: stats, isLoading } = useDashboardOverview();

    if (isLoading) return <LoadingSpinner />;

    const statsData = [
        {
            title: 'Tổng doanh thu',
            value: stats?.data
                ? `${(stats.data.totalRevenue || 0).toLocaleString('vi-VN')} đ`
                : '0 đ',
            icon: TrendingUp,
            color: '#22c55e',
            description: 'Tháng này',
        },
        {
            title: 'Vé bán',
            value: (stats?.data?.totalTicketsSold || 0).toLocaleString('vi-VN'),
            icon: Users,
            color: '#3b82f6',
            description: 'Tổng tất cả',
        },
        {
            title: 'Phim',
            value: (stats?.data?.totalMovies || 0).toLocaleString('vi-VN'),
            icon: Film,
            color: '#f59e0b',
            description: 'Đang chiếu',
        },
        {
            title: 'Suất chiếu',
            value: (stats?.data?.totalShowtimes || 0).toLocaleString('vi-VN'),
            icon: Clock,
            color: '#8b5cf6',
            description: 'Tuần này',
        },
    ];

    return (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
            {statsData.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                    <Card key={idx} shadow="sm" padding="lg" radius="md" withBorder>
                        <Group justify="space-between" mb="md">
                            <div>
                                <Text size="sm" c="dimmed" fw={500}>
                                    {stat.title}
                                </Text>
                                <Text fw={700} size="lg" mt={4}>
                                    {stat.value}
                                </Text>
                                <Text size="xs" c="dimmed" mt={4}>
                                    {stat.description}
                                </Text>
                            </div>
                            <div
                                className="p-3 rounded-lg"
                                style={{ backgroundColor: `${stat.color}20` }}
                            >
                                <Icon size={32} color={stat.color} strokeWidth={1.5} />
                            </div>
                        </Group>
                    </Card>
                );
            })}
        </SimpleGrid>
    );
}