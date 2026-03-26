import { useMemo } from 'react';
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
  const { data: overviewData, isLoading: overviewLoading } =
    useDashboardOverview();
  const { data: revenueData, isLoading: revenueLoading } =
    useRevenueStats('day');
  const { data: occupancyData, isLoading: occupancyLoading } =
    useOccupancyByRoom();
  useTopMoviesByRevenue(4); // Fetch nhưng chưa dùng

  // Mock data cho Revenue Trends chart (sẽ lấy từ revenueData khi API trả về)
  const revenueChartData = useMemo(() => {
    if (!revenueData?.data) {
      return [
        { day: 'MON', tickets: 48, concessions: 32 },
        { day: 'TUE', tickets: 36, concessions: 24 },
        { day: 'WED', tickets: 56, concessions: 40 },
        { day: 'THU', tickets: 52, concessions: 36 },
        { day: 'FRI', tickets: 64, concessions: 52 },
        { day: 'SAT', tickets: 72, concessions: 60 },
        { day: 'SUN', tickets: 60, concessions: 48 },
      ];
    }

    // Transform API data nếu cần
    return revenueData.data.map((item: any) => ({
      day: item._id,
      revenue: item.revenue,
      bookings: item.bookings,
    }));
  }, [revenueData]);

  // Screening performance từ occupancy data
  const screeningData = useMemo(() => {
    if (!occupancyData?.data) {
      return [
        {
          id: 1,
          name: 'Cinema 01',
          location: 'North Wing',
          format: 'IMAX 4K',
          occupancy: 88,
          peakHours: '19:00 - 22:30',
          status: 'Live Now',
          statusType: 'live',
        },
        {
          id: 2,
          name: 'Cinema 02',
          location: 'Main Floor',
          format: 'Standard',
          occupancy: 62,
          peakHours: '15:00 - 18:00',
          status: 'Next: 45 min',
          statusType: 'next',
        },
        {
          id: 5,
          name: 'Cinema 05',
          location: 'VIP Lounge',
          format: 'Dolby Atmos',
          occupancy: 94,
          peakHours: '21:00 - 00:00',
          status: 'Sold Out',
          statusType: 'soldout',
        },
      ];
    }

    return occupancyData.data.map((room: any) => ({
      id: room.roomId,
      name: room.roomName,
      location: room.roomType || 'Standard',
      format: room.roomType || 'Standard',
      occupancy: Math.round(room.occupancyRate),
      peakHours: 'All day',
      status: room.occupancyRate >= 90 ? 'Full' : 'Available',
      statusType: room.occupancyRate >= 90 ? 'soldout' : 'live',
    }));
  }, [occupancyData]);

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
        label: 'Success Rate',
        value: `${overviewData?.data?.successRate || 0}%`,
        icon: '✅',
        trend: '+2.1%',
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
        <p className="text-[#c2c6d8]">
          Các chỉ số hiệu suất thực tế cho tuần của Midnight Premiere.
        </p>
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
                  Xu Hướng Doanh Thu
                </h3>
                <p className="text-sm text-[#8c90a1]">
                  Doanh thu vé vs. Doanh thu thực phẩm
                </p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#0066ff] shadow-[0_0_10px_rgba(0,102,255,0.5)]"></div>
                  <span className="text-xs font-medium text-[#8c90a1] uppercase tracking-wider">
                    Vé
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#284386]"></div>
                  <span className="text-xs font-medium text-[#8c90a1] uppercase tracking-wider">
                    Thực Phẩm
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
                    className={`border-b w-full h-px ${i === 4 ? 'border-[#424656]/10' : 'border-[#424656]/5'
                      }`}
                  ></div>
                ))}
              </div>

              {/* Bars */}
              <div className="flex-grow flex items-end justify-between px-4 h-full relative z-10 gap-1">
                {revenueChartData.map(
                  (item: Record<string, unknown>, idx: number) => (
                    <div
                      key={idx}
                      className="group relative w-full flex flex-col items-center"
                    >
                      <div className="w-1/2 bg-[#0066ff]/20 rounded-t-lg h-32 transition-all group-hover:bg-[#0066ff]/40"></div>
                      <div className="w-full bg-[#0066ff] rounded-t-lg h-48 shadow-[0_-4px_15px_rgba(0,102,255,0.2)]"></div>
                      <span className="text-[10px] mt-2 font-bold opacity-40">
                        {String(item.day)}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Lower Grid Section */}
          <div className="grid grid-cols-2 gap-6">
            {/* Revenue by Genre */}
            <div className="bg-[#131b2e] rounded-2xl p-8">
              <h3 className="text-lg font-bold text-[#dae2fd] mb-6">
                Doanh Thu Theo Thể Loại
              </h3>
              <div className="flex items-center gap-8">
                {/* Donut Chart */}
                <div className="relative w-32 h-32 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 36 36"
                  >
                    <circle
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="text-[#222a3d]"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeDasharray="45, 100"
                      strokeLinecap="round"
                      className="text-[#0066ff]"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeDasharray="25, 100"
                      strokeDashoffset="-45"
                      strokeLinecap="round"
                      className="text-[#284386]"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold">
                      ${(overviewData?.data?.totalRevenue / 1000).toFixed(1)}k
                    </span>
                    <span className="text-[10px] text-[#8c90a1] uppercase tracking-tighter">
                      Tổng Cộng
                    </span>
                  </div>
                </div>

                {/* Legend - Mock data (tạm thời) */}
                <div className="flex-grow space-y-3">
                  {[
                    { label: 'Action', value: 45, color: 'bg-[#0066ff]' },
                    { label: 'Drama', value: 25, color: 'bg-[#284386]' },
                    { label: 'Comedy', value: 15, color: 'bg-[#0066ff]' },
                    { label: 'Horror', value: 15, color: 'bg-[#ffb4ac]' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${item.color}`}
                        ></div>
                        <span className="text-xs text-[#8c90a1]">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-xs font-bold">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Operational Metrics */}
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

          {/* Screening Performance Table */}
          <div className="bg-[#131b2e] rounded-2xl overflow-hidden">
            <div className="p-8 border-b border-[#424656]/10 flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#dae2fd]">
                Hiệu Suất Chiếu Phim
              </h3>
              <button className="text-[#0066ff] text-xs font-bold uppercase tracking-widest hover:underline">
                Xem Tất Cả Phòng
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#222a3d]/50 text-[10px] font-bold text-[#8c90a1] uppercase tracking-widest">
                    <th className="px-8 py-4">Phòng Chiếu</th>
                    <th className="px-8 py-4">Định Dạng</th>
                    <th className="px-8 py-4">Độ Lấp Đầy</th>
                    <th className="px-8 py-4">Giờ Peak</th>
                    <th className="px-8 py-4 text-right">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#424656]/5">
                  {screeningData.map((item: Record<string, unknown>) => (
                    <tr
                      key={String(item.id)}
                      className="hover:bg-[#222a3d]/20 transition-colors"
                    >
                      <td className="px-8 py-6">
                        <p className="font-bold text-[#dae2fd]">
                          {String(item.name)}
                        </p>
                        <p className="text-xs text-[#8c90a1]">
                          {String(item.location)}
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
                      <td className="px-8 py-6 text-xs text-[#8c90a1]">
                        {String(item.peakHours)}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span
                          className={`flex items-center justify-end gap-1.5 text-xs font-bold ${String(item.statusType) === 'live'
                              ? 'text-[#0066ff]'
                              : String(item.statusType) === 'soldout'
                                ? 'text-[#ffb4ac]'
                                : 'text-[#8c90a1]'
                            }`}
                        >
                          {String(item.statusType) === 'live' && (
                            <span className="w-1.5 h-1.5 bg-[#0066ff] rounded-full animate-pulse"></span>
                          )}
                          {String(item.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Recent Bookings */}
          <div className="bg-[#131b2e] rounded-2xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-[#dae2fd]">
                Đặt Vé Gần Đây
              </h3>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#222a3d] hover:bg-[#2d3449] transition-colors">
                <span className="text-lg">⋯</span>
              </button>
            </div>
            <div className="space-y-6">
              {[
                {
                  title: 'Nebula Protocol',
                  hall: 'Hall 01',
                  tickets: '2',
                  time: '2 mins',
                },
                {
                  title: 'The Last Waltz',
                  hall: 'Hall 05',
                  tickets: '4',
                  time: '14 mins',
                },
                {
                  title: 'Neon Drift',
                  hall: 'Hall 02',
                  tickets: '1',
                  time: '21 mins',
                },
              ].map((booking, idx) => (
                <div key={idx} className="flex gap-4 group cursor-pointer">
                  <div className="w-12 h-16 rounded-lg bg-[#222a3d] flex-shrink-0 flex items-center justify-center text-2xl">
                    🎬
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-bold text-[#dae2fd] line-clamp-1">
                      {booking.title}
                    </p>
                    <p className="text-[11px] text-[#8c90a1] mb-1">
                      {booking.hall} • {booking.tickets} Vé
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] bg-[#0066ff]/10 text-[#0066ff] px-1.5 py-0.5 rounded-md font-bold">
                        ĐÃ THANH TOÁN
                      </span>
                      <span className="text-[10px] text-[#8c90a1] font-medium">
                        {booking.time} trước
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
