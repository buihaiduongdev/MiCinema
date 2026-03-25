/**
 * DashboardPage — Trang dashboard admin
 *
 * Compose: <StatCards /> + <RevenueChart /> + <OccupancyChart /> + <TopMoviesChart />
 * Grid layout responsive
 */

import { Stack } from '@mantine/core';
import StatCards from '../components/StatCards';
import RevenueChart from '../components/RevenueChart';
import OccupancyChart from '../components/OccupancyChart';
import TopMoviesChart from '../components/TopMoviesChart';

/**
 * DashboardPage — Dashboard tổng quan (UC-33, UC-34, UC-35, UC-36)
 */

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-2">Tổng quan các chỉ số quản lý</p>
                </div>

                <Stack gap="lg">
                    {/* Stat Cards */}
                    <StatCards />

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <RevenueChart />
                        <OccupancyChart />
                    </div>

                    {/* Top Movies */}
                    <TopMoviesChart />
                </Stack>
            </div>
        </div>
    );
}