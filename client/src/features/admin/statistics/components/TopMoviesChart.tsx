import { Card, Text, Stack, Group, Badge, Table } from '@mantine/core';
import { TrendingUp } from 'lucide-react';
import { useTopMoviesByRevenue } from '../hooks/useStatistics';
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner';

/**
 * TopMoviesChart — Top phim doanh thu cao (UC-36)
 * Xếp hạng phim theo doanh thu, lượt xem
 */

export default function TopMoviesChart() {
    const { data: moviesData, isLoading } = useTopMoviesByRevenue(10);

    if (isLoading) return <LoadingSpinner />;

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="md">
                <Group>
                    <TrendingUp size={24} className="text-blue-600" />
                    <div>
                        <Text fw={700} size="lg">
                            Top 10 phim doanh thu cao
                        </Text>
                        <Text size="sm" c="dimmed">
                            Xếp hạng theo doanh thu
                        </Text>
                    </div>
                </Group>

                {moviesData?.data && moviesData.data.length > 0 ? (
                    <div className="overflow-x-auto">
                        <Table striped highlightOnHover>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th style={{ width: '10%' }}>Hạng</Table.Th>
                                    <Table.Th style={{ width: '40%' }}>Tên phim</Table.Th>
                                    <Table.Th style={{ width: '25%' }}>Doanh thu</Table.Th>
                                    <Table.Th style={{ width: '25%' }}>Lượt xem</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {moviesData.data.map((movie: any, idx) => (
                                    <Table.Tr key={idx}>
                                        <Table.Td>
                                            <Badge size="lg" variant="gradient">
                                                #{movie.rank || idx + 1}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text fw={500} truncate>
                                                {movie.movieTitle}
                                            </Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text fw={600} c="green">
                                                {movie.revenue.toLocaleString('vi-VN')} đ
                                            </Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text fw={500}>
                                                {movie.viewCount.toLocaleString('vi-VN')} lượt
                                            </Text>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
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
