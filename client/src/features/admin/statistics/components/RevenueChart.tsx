/**
 * RevenueChart — Biểu đồ doanh thu
 *
 * Dùng: CSS bars thay vì Recharts
 * Data: transform raw data → chart format
 * Filter: theo ngày/tuần/tháng
 */

import { Card, Select, Group, Text, Stack, Badge } from '@mantine/core';
import { useState, useMemo } from 'react';
import { useRevenueStatistics } from '../hooks/useStatistics';
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner';

/**
 * RevenueChart — Thống kê doanh thu theo ngày/tuần/tháng (UC-34)
 */

export default function RevenueChart() {
    const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month'>('day');
    const [startDate] = useState<Date>(
        new Date(new Date().setDate(new Date().getDate() - 30)),
    );
    const [endDate] = useState<Date>(new Date());

    const { data: revenueData, isLoading } = useRevenueStatistics(
        startDate,
        endDate,
        groupBy,
    );

    const chartData = useMemo(() => {
        if (!revenueData?.data) return [];
        const maxRevenue = Math.max(
            ...revenueData.data.map((item) => item.revenue),
            1,
        );
        return revenueData.data.map((item) => ({
            date: item.date,
            revenue: item.revenue,
            percentage: (item.revenue / maxRevenue) * 100,
        }));
    }, [revenueData?.data]);

    const totalRevenue = useMemo(() => {
        return (revenueData?.data || []).reduce((sum, item) => sum + item.revenue, 0);
    }, [revenueData?.data]);

    if (isLoading) return <LoadingSpinner />;

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="md">
                <Group justify="space-between">
                    <div>
                        <Text fw={700} size="lg">
                            Doanh thu
                        </Text>
                        <Text size="sm" c="dimmed">
                            {groupBy === 'day'
                                ? 'Theo ngày'
                                : groupBy === 'week'
                                    ? 'Theo tuần'
                                    : 'Theo tháng'}
                        </Text>
                    </div>
                    <Select
                        data={[
                            { value: 'day', label: 'Theo ngày' },
                            { value: 'week', label: 'Theo tuần' },
                            { value: 'month', label: 'Theo tháng' },
                        ]}
                        value={groupBy}
                        onChange={(val) => setGroupBy((val as any) || 'day')}
                        w={150}
                    />
                </Group>

                <Badge size="lg" variant="light" color="green">
                    Tổng: {totalRevenue.toLocaleString('vi-VN')} đ
                </Badge>

                {chartData.length > 0 ? (
                    <div className="space-y-4">
                        {chartData.map((item, idx) => (
                            <div key={idx} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">{item.date}</span>
                                    <span className="text-green-600 font-semibold">
                                        {item.revenue.toLocaleString('vi-VN')} đ
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-green-400 to-green-600"
                                        style={{ width: `${item.percentage}%` }}
                                    />
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