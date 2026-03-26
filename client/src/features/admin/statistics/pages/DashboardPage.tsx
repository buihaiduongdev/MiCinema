import { useMemo, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import {
  useDashboardOverview,
  useRevenueStats,
  useOccupancyByRoom,
  useTopMoviesByRevenue,
} from '../hooks/useDashboardStats';
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner';

/**
 * DashboardPage — Trang dashboard admin với analytics từ API
 * Hiển thị: Revenue Trends, Revenue by Genre, Operational Metrics, Screening Performance
 */
export default function DashboardPage() {
  const [occupancyPage, setOccupancyPage] = useState(1);
  const occupancyPageSize = 3;
  const [revenueGroupBy, setRevenueGroupBy] = useState<'day' | 'week' | 'month'>('day');
  const { data: overviewData, isLoading: overviewLoading } =
    useDashboardOverview();
  const { data: revenueData, isLoading: revenueLoading } =
    useRevenueStats(revenueGroupBy);
  const { data: occupancyData, isLoading: occupancyLoading } =
    useOccupancyByRoom();
  const { data: topMoviesData, isLoading: topMoviesLoading } =
    useTopMoviesByRevenue(5);

  const revenueChartData = useMemo(() => {
    const apiData = revenueData?.data?.data;

    if (!apiData || apiData.length === 0) {
      return [];
    }

    return apiData.map((item: any) => ({
      day: item._id,
      revenue: item.revenue ?? 0,
      bookings: item.bookings ?? 0,
    }));
  }, [revenueData]);

  const maxRevenue = useMemo(() => {
    if (!revenueChartData.length) return 1;
    return Math.max(
      ...revenueChartData.map((item: { revenue: number }) => item.revenue),
      1,
    );
  }, [revenueChartData]);


  // Screening performance từ occupancy data
  const screeningData = useMemo(() => {
    if (!occupancyData?.data?.byRoom) {
      return [];
    }

    return occupancyData.data.byRoom.map((room: any) => ({
      id: room.roomId,
      name: room.roomName,
      format: room.roomType || 'Standard',
      occupancy: Math.round(room.occupancyRate),
      bookedSeats: room.bookedSeats ?? 0,
      totalSeats: room.totalSeats ?? 0,
    }));
  }, [occupancyData]);

  const totalOccupancyPages = Math.max(
    1,
    Math.ceil(screeningData.length / occupancyPageSize),
  );

  const pagedScreeningData = useMemo(() => {
    const start = (occupancyPage - 1) * occupancyPageSize;
    return screeningData.slice(start, start + occupancyPageSize);
  }, [occupancyPage, screeningData]);

  // Metrics từ overview data
  const metrics = useMemo(
    () => [
      {
        label: 'Total Revenue',
        value: overviewData?.data?.totalRevenue
          ? `$${(overviewData.data.totalRevenue / 1000).toFixed(1)}k`
          : '$0',
        icon: '💰',
        trend: '+12.5%',
        trendUp: true,
      },
      {
        label: 'Total Bookings',
        value: overviewData?.data?.totalBookings || '0',
        icon: '🎫',
        trend: '+5.2%',
        trendUp: true,
      },
      {
        label: 'Total Movies',
        value: overviewData?.data?.totalMovies || '0',
        icon: '🎬',
        trend: '+3.1%',
        trendUp: true,
      },
      {
        label: 'Total Showtimes',
        value: overviewData?.data?.totalShowtimes || '0',
        icon: '⏰',
        trend: '+8.4%',
        trendUp: true,
      },
    ],
    [overviewData],
  );

  const isLoading = overviewLoading || revenueLoading || occupancyLoading;

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#dae2fd] mb-2">
          Thống Kê Hoạt Động
        </h1>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Revenue Analytics (Large Section) */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Revenue Trends Chart */}
          <div className="bg-[#131b2e] rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#0066ff]/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>

            {/* Chart Header */}
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div>
                <h3 className="text-xl font-bold text-[#dae2fd]">
                  Thống Kê Doanh Thu
                </h3>
                <p className="text-sm text-[#8c90a1]">
                  Doanh thu theo {revenueGroupBy === 'day'
                    ? 'ngày'
                    : revenueGroupBy === 'week'
                      ? 'tuần'
                      : 'tháng'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {(['day', 'week', 'month'] as const).map((option) => (
                  <button
                    key={option}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors ${revenueGroupBy === option
                      ? 'bg-[#0066ff] text-white'
                      : 'bg-[#222a3d] text-[#8c90a1] hover:bg-[#2d3449]'
                      }`}
                    onClick={() => setRevenueGroupBy(option)}
                  >
                    {option === 'day' ? 'Ngày' : option === 'week' ? 'Tuần' : 'Tháng'}
                  </button>
                ))}
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#0066ff] shadow-[0_0_10px_rgba(0,102,255,0.5)]"></div>
                  <span className="text-xs font-medium text-[#8c90a1] uppercase tracking-wider">
                    Doanh Thu
                  </span>
                </div>
              </div>
            </div>

            {/* Chart Area */}
            <div className="h-80 w-full flex items-end gap-2 relative">
              <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`border-b w-full h-px ${
                      i === 4 ? 'border-[#424656]/10' : 'border-[#424656]/5'
                    }`}
                  ></div>
                ))}
              </div>

              {/* Bars */}
              <div className="flex-grow flex items-end justify-between px-4 h-full relative z-10 gap-1">
                {revenueChartData.length > 0 ? (
                  revenueChartData.map((item: any, idx: number) => {
                    const heightPercent = Math.max(
                      8,
                      Math.round((item.revenue / maxRevenue) * 100),
                    );

                    return (
                      <div
                        key={idx}
                        className="group relative w-full flex flex-col items-center"
                      >
                        <div
                          className="w-full bg-[#0066ff] rounded-t-lg shadow-[0_-4px_15px_rgba(0,102,255,0.2)] transition-all group-hover:bg-[#2a7bff]"
                          style={{ height: `${heightPercent}%` }}
                        ></div>
                        <span className="text-[10px] mt-2 font-bold opacity-40">
                          {String(item.day)}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="w-full text-center text-sm text-[#8c90a1]">
                    Chưa có dữ liệu doanh thu.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Screening Performance Table */}
          <div className="bg-[#131b2e] rounded-2xl overflow-hidden">
            <div className="p-8 border-b border-[#424656]/10 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#dae2fd]">
                  Thống Kê Tỷ Lệ Lấp Đầy
                </h3>
                <p className="text-xs text-[#8c90a1]">
                  % ghế đã bán theo phòng, theo suất chiếu
                </p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#222a3d]/50 text-[10px] font-bold text-[#8c90a1] uppercase tracking-widest">
                    <th className="px-8 py-4">Phòng Chiếu</th>
                    <th className="px-8 py-4">Định Dạng</th>
                    <th className="px-8 py-4">Độ Lấp Đầy</th>
                    <th className="px-8 py-4 text-right">Ghế Đã Bán</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#424656]/5">
                  {pagedScreeningData.map((item: Record<string, unknown>) => (
                    <tr
                      key={String(item.id)}
                      className="hover:bg-[#222a3d]/20 transition-colors"
                    >
                      <td className="px-8 py-6">
                        <p className="font-bold text-[#dae2fd]">
                          {String(item.name)}
                        </p>
                      </td>
                      <td className="px-8 py-6">
                        <span
                          className={`px-3 py-1 text-[10px] font-extrabold rounded-full border ${String(item.format) === 'IMAX 4K'
                            ? 'bg-[#0066ff]/10 text-[#0066ff] border-[#0066ff]/20'
                            : String(item.format) === 'Dolby Atmos'
                              ? 'bg-[#ffb4ac]/10 text-[#ffb4ac] border-[#ffb4ac]/20'
                              : 'bg-[#222a3d] text-[#8c90a1]'
                            }`}
                        >
                          {String(item.format)}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="flex-grow w-24 h-1.5 bg-[#131b2e] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#0066ff] rounded-full"
                              style={{ width: `${Number(item.occupancy)}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-bold">
                            {Number(item.occupancy)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right text-xs text-[#8c90a1]">
                        {Number(item.bookedSeats)} / {Number(item.totalSeats)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {screeningData.length > occupancyPageSize && (
              <div className="flex items-center justify-between px-8 py-4 text-xs text-[#8c90a1]">
                <span>
                  Trang {occupancyPage} / {totalOccupancyPages}
                </span>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 rounded-md bg-[#222a3d] hover:bg-[#2d3449] disabled:opacity-50"
                    onClick={() => setOccupancyPage((p) => Math.max(1, p - 1))}
                    disabled={occupancyPage === 1}
                  >
                    Trước
                  </button>
                  <button
                    className="px-3 py-1 rounded-md bg-[#222a3d] hover:bg-[#2d3449] disabled:opacity-50"
                    onClick={() =>
                      setOccupancyPage((p) => Math.min(totalOccupancyPages, p + 1))
                    }
                    disabled={occupancyPage === totalOccupancyPages}
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Summary Metrics */}
          <div className="space-y-4">
            {metrics.map((metric, idx) => (
              <div
                key={idx}
                className="bg-[#131b2e] rounded-2xl p-5 flex items-center gap-4 hover:bg-[#171f33] transition-colors"
              >
                <div className="text-2xl">{metric.icon}</div>
                <div className="flex-grow">
                  <p className="text-xs text-[#8c90a1] font-medium">
                    {metric.label}
                  </p>
                  <h4 className="text-xl font-bold text-[#dae2fd]">
                    {metric.value}
                  </h4>
                </div>
                <div className="text-[#0066ff] text-[10px] font-bold flex items-center gap-1">
                  <TrendingUp size={12} />
                  {metric.trend}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Top Movies by Revenue Section - Full Width */}
      <div className="bg-[#131b2e] rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-[#dae2fd] mb-8">
          🎬 Top Phim Doanh Thu Cao
        </h3>
        {topMoviesLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-2">
            {topMoviesData?.data && Array.isArray(topMoviesData.data) && topMoviesData.data.length > 0 ? (
              topMoviesData.data.map((movie: any, idx: number) => (
                <div
                  key={movie.movieId || idx}
                  className="group bg-[#0b0e18] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1 border border-[#222a3d] hover:border-primary/50 min-w-[280px] max-w-[320px] flex-shrink-0"
                >
                  <div className="relative overflow-hidden h-48 bg-[#222a3d] flex items-center justify-center">
                    {movie.moviePoster ? (
                      <img
                        src={movie.moviePoster}
                        alt={movie.movieTitle}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <span className="text-7xl">🎬</span>
                    )}
                    <div className="absolute top-3 left-3 bg-primary text-white font-bold px-4 py-2 rounded-lg text-lg shadow-lg">
                      #{idx + 1}
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-lg font-bold text-[#dae2fd] mb-3 line-clamp-2 min-h-[3.5rem]">
                      {movie.movieTitle || 'Unknown'}
                    </h4>
                    <div className="space-y-3 mb-4 bg-[#131b2e] rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-[#8c90a1] font-medium">Doanh Thu:</span>
                        <span className="text-lg font-bold text-[#0066ff]">
                          ${(movie.totalRevenue / 1000).toFixed(1)}k
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-[#8c90a1] font-medium">Vé Bán:</span>
                        <span className="text-base font-bold text-[#dae2fd]">
                          {movie.totalBookings || 0} vé
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-[#8c90a1] font-medium">Lượt Xem:</span>
                        <span className="text-base font-bold text-[#dae2fd]">
                          {Math.round((movie.viewCount || 0) / 1000)}k
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-[#8c90a1] font-medium">Giá TB:</span>
                        <span className="text-base font-bold text-[#dae2fd]">
                          ${(movie.averageTicketPrice || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-[#222a3d]">
                      <div className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full font-bold">
                        TOP #{idx + 1}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full text-center text-[#8c90a1] py-12">
                <p className="text-lg">Không có dữ liệu phim</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
