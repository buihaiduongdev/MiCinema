import { useState } from 'react';
import { Select, Group, Badge } from '@mantine/core';
import { DataTable, type DataTableColumn } from '../../../../components/ui/DataTable';
import { useMemberRankingByPoints, useMemberRankingByTier } from '../hooks/useLoyalty';
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner';
import { EmptyState } from '../../../../components/ui/EmptyState';
import { Trophy, Medal } from 'lucide-react';

/**
 * MemberRankingPage — Trang bảng xếp hạng thành viên (UC-51)
 * Top khách hàng theo điểm, theo hạng
 */

export default function MemberRankingPage() {
    const [sortBy, setSortBy] = useState<'points' | 'tier'>('points');
    const [limit, setLimit] = useState(50);

    const { data: pointsRanking, isLoading: isLoadingPoints } =
        useMemberRankingByPoints(limit);
    const { data: tierRanking, isLoading: isLoadingTier } =
        useMemberRankingByTier(limit);

    const isLoading = sortBy === 'points' ? isLoadingPoints : isLoadingTier;
    const rankingData = sortBy === 'points' ? pointsRanking?.data : tierRanking?.data;

    const getTierColor = (tier: string) => {
        if (tier === 'GOLD') return 'yellow';
        if (tier === 'SILVER') return 'gray';
        return 'orange';
    };

    const getTierLabel = (tier: string) => {
        if (tier === 'GOLD') return '🥇 Gold';
        if (tier === 'SILVER') return '🥈 Silver';
        return '🥉 Bronze';
    };

    const columns: DataTableColumn[] = [
        {
            key: 'rank',
            header: 'Hạng',
            width: '8%',
            render: (row: any) => (
                <div className="flex items-center gap-2">
                    {row.rank === 1 && <Trophy size={20} className="text-yellow-500" />}
                    {row.rank === 2 && <Medal size={20} className="text-gray-400" />}
                    {row.rank === 3 && <Medal size={20} className="text-orange-600" />}
                    <span className="font-bold">#{row.rank}</span>
                </div>
            ),
        },
        {
            key: 'fullName',
            header: 'Tên thành viên',
            width: '25%',
        },
        {
            key: 'email',
            header: 'Email',
            width: '25%',
            render: (row: any) => (
                <span className="text-gray-600 text-sm">{row.email}</span>
            ),
        },
        {
            key: 'membershipTier',
            header: 'Hạng thành viên',
            width: '20%',
            render: (row: any) => (
                <Badge color={getTierColor(row.membershipTier)} variant="light">
                    {getTierLabel(row.membershipTier)}
                </Badge>
            ),
        },
        {
            key: 'loyaltyPoints',
            header: 'Điểm tích lũy',
            width: '22%',
            render: (row: any) => (
                <span className="font-bold text-blue-600">
                    {row.loyaltyPoints.toLocaleString('vi-VN')} pts
                </span>
            ),
        },
    ];

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Bảng xếp hạng thành viên
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Top khách hàng theo điểm tích lũy và hạng thành viên
                    </p>
                </div>

                {/* Filter */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <Group justify="space-between">
                        <Select
                            label="Sắp xếp theo"
                            placeholder="Chọn tiêu chí"
                            data={[
                                { value: 'points', label: 'Điểm tích lũy' },
                                { value: 'tier', label: 'Hạng thành viên' },
                            ]}
                            value={sortBy}
                            onChange={(val) => setSortBy((val as any) || 'points')}
                            w={200}
                        />

                        <Select
                            label="Hiển thị"
                            placeholder="Chọn số lượng"
                            data={[
                                { value: '10', label: 'Top 10' },
                                { value: '20', label: 'Top 20' },
                                { value: '50', label: 'Top 50' },
                                { value: '100', label: 'Top 100' },
                            ]}
                            value={limit.toString()}
                            onChange={(val) => {
                                setLimit(parseInt(val || '50'));
                            }}
                            w={150}
                        />
                    </Group>
                </div>

                {/* Table */}
                {rankingData && rankingData.length > 0 ? (
                    <div className="bg-white rounded-lg shadow">
                        <DataTable
                            columns={columns}
                            data={rankingData as any}
                            rowKey="userId"
                            loading={isLoading}
                        />
                    </div>
                ) : (
                    <EmptyState
                        title="Không có dữ liệu"
                        description="Chưa có thành viên nào trong hệ thống"
                    />
                )}
            </div>
        </div>
    );
}
