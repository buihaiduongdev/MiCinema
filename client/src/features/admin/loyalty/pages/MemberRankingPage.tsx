import { useState } from 'react';
import { useMemberRankingByPoints, useMemberRankingByTier, useTierStats } from '../hooks/useLoyaltyStats';
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner';
import { Trophy, TrendingUp, Users } from 'lucide-react';

type SortBy = 'points' | 'tier';
type FilterTier = 'all' | 'GOLD' | 'SILVER' | 'BRONZE';

export const MemberRankingPage = () => {
  const [sortBy, setSortBy] = useState<SortBy>('points');
  const [filterTier, setFilterTier] = useState<FilterTier>('all');
  const [displayLimit, setDisplayLimit] = useState(20);

  const { data: rankingByPoints, isLoading: loadingPoints } = useMemberRankingByPoints(displayLimit);
  const { data: rankingByTier, isLoading: loadingTier } = useMemberRankingByTier(displayLimit);
  const { tierBreakdown, isLoading: loadingTierStats } = useTierStats(1000);

  const currentRanking = sortBy === 'points' ? rankingByPoints : rankingByTier;
  const isLoading = sortBy === 'points' ? loadingPoints : loadingTier;

  // Filter by tier
  const filteredRanking = filterTier === 'all' ? currentRanking : currentRanking?.filter((m) => m.membershipTier === filterTier);

  const getTierBgColor = (tier: string) => {
    switch (tier) {
      case 'GOLD':
        return 'bg-primary-container/10 text-primary border-primary/20';
      case 'SILVER':
        return 'bg-slate-500/10 text-slate-300 border-slate-500/20';
      case 'BRONZE':
        return 'bg-tertiary-container/20 text-tertiary border-tertiary/30';
      default:
        return 'bg-surface-container/10 text-on-surface border-surface-variant/20';
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-surface">
      {/* Content */}
      <section className="px-8 py-8 space-y-8 max-w-[1600px] mx-auto w-full">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight text-on-surface mb-1">Bảng Xếp Hạng Thành Viên</h1>
          <p className="text-sm text-on-surface-variant">Theo dõi phân bố hạng loyalty và hiệu suất thành viên</p>
        </div>

        {/* Tier Overview: Bento Grid Layout */}
        {!loadingTierStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Gold Tier Card */}
            <div className="relative overflow-hidden bg-surface-container rounded-3xl p-8 group transition-all duration-300 hover:bg-surface-container-highest flex flex-col justify-between min-h-[200px]">
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                <span className="material-symbols-outlined text-[140px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  workspace_premium
                </span>
              </div>
              <div>
                <span className="px-3 py-1 bg-primary-container/20 text-primary text-[10px] font-bold tracking-widest uppercase rounded-full border border-primary/30">
                  Hạng 01
                </span>
                <h3 className="text-3xl font-headline font-extrabold mt-3 text-primary">Gold Elite</h3>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-4xl font-headline font-black">{tierBreakdown.gold}</p>
                  <p className="text-xs text-on-surface-variant font-medium">Thành Viên Hoạt Động</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
              </div>
            </div>

            {/* Silver Tier Card */}
            <div className="relative overflow-hidden bg-surface-container rounded-3xl p-8 group transition-all duration-300 hover:bg-surface-container-highest flex flex-col justify-between min-h-[200px]">
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                <span className="material-symbols-outlined text-[140px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  stars
                </span>
              </div>
              <div>
                <span className="px-3 py-1 bg-slate-500/20 text-slate-300 text-[10px] font-bold tracking-widest uppercase rounded-full border border-slate-500/30">
                  Hạng 02
                </span>
                <h3 className="text-3xl font-headline font-extrabold mt-3 text-slate-200">Silver Star</h3>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-4xl font-headline font-black">{tierBreakdown.silver}</p>
                  <p className="text-xs text-on-surface-variant font-medium">Thành Viên Hoạt Động</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-slate-500/10 flex items-center justify-center border border-slate-500/20">
                  <Users className="w-5 h-5 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Bronze Tier Card */}
            <div className="relative overflow-hidden bg-surface-container rounded-3xl p-8 group transition-all duration-300 hover:bg-surface-container-highest flex flex-col justify-between min-h-[200px]">
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                <span className="material-symbols-outlined text-[140px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  military_tech
                </span>
              </div>
              <div>
                <span className="px-3 py-1 bg-tertiary-container/20 text-tertiary text-[10px] font-bold tracking-widest uppercase rounded-full border border-tertiary/30">
                  Hạng 03
                </span>
                <h3 className="text-3xl font-headline font-extrabold mt-3 text-tertiary">Bronze Basic</h3>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-4xl font-headline font-black">{tierBreakdown.bronze}</p>
                  <p className="text-xs text-on-surface-variant font-medium">Thành Viên Hoạt Động</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-tertiary/10 flex items-center justify-center border border-tertiary/20">
                  <Users className="w-5 h-5 text-tertiary" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top Spenders Table Section */}
        <div className="bg-surface-container-low rounded-3xl p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-2xl font-headline font-extrabold">Khách Hàng Chi Tiêu Nhiều Nhất</h3>
              <p className="text-on-surface-variant text-sm">Theo dõi hiệu suất thành viên có giá trị loyalty cao nhất</p>
            </div>
            <div className="flex gap-4 flex-wrap">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="bg-surface-container border border-outline/20 rounded-full px-6 py-2 text-sm text-on-surface focus:ring-2 focus:ring-primary/30 outline-none transition-all"
              >
                <option value="points">Sắp xếp theo Điểm</option>
                <option value="tier">Sắp xếp theo Hạng</option>
              </select>
              <select
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value as FilterTier)}
                className="bg-surface-container border border-outline/20 rounded-full px-6 py-2 text-sm text-on-surface focus:ring-2 focus:ring-primary/30 outline-none transition-all"
              >
                <option value="all">Tất Cả Hạng</option>
                <option value="GOLD">Chỉ Gold</option>
                <option value="SILVER">Chỉ Silver</option>
                <option value="BRONZE">Chỉ Bronze</option>
              </select>
              <button className="bg-surface-container p-2.5 rounded-full hover:bg-surface-container-highest transition-colors border border-outline/20">
                <span className="material-symbols-outlined">filter_list</span>
              </button>
            </div>
          </div>

          {isLoading && <LoadingSpinner />}

          {!isLoading && filteredRanking && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-surface-container-high text-on-surface-variant text-xs font-bold tracking-widest uppercase border-b border-outline/10">
                    <th className="px-6 py-4 rounded-tl-xl">Hạng</th>
                    <th className="px-6 py-4">Tên Thành Viên</th>
                    <th className="px-6 py-4">Hạng Thành Viên</th>
                    <th className="px-6 py-4">Điểm Tích Lũy</th>
                    <th className="px-6 py-4">Thành Viên Từ</th>
                    <th className="px-6 py-4 rounded-tr-xl text-right">Hành Động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline/5">
                  {filteredRanking.map((member) => (
                    <tr key={member.userId} className="hover:bg-surface-container-highest/40 transition-colors group">
                      <td className="px-6 py-5">
                        <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                          {member.rank}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant overflow-hidden">
                            {member.avatar ? (
                              <img src={member.avatar} alt={member.fullName} className="w-full h-full object-cover" />
                            ) : (
                              <span className="material-symbols-outlined">person</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm truncate">{member.fullName}</p>
                            <p className="text-xs text-on-surface-variant truncate">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getTierBgColor(member.membershipTier)}`}>
                          {member.membershipTier}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <p className="font-mono font-semibold text-on-surface">{member.loyaltyPoints.toLocaleString()} pts</p>
                      </td>
                      <td className="px-6 py-5 text-on-surface-variant">
                        {member.memberSince ? new Date(member.memberSince).toLocaleDateString('vi-VN') : 'N/A'}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className="text-primary text-xs font-bold px-4 py-2 hover:bg-primary/10 rounded-full transition-all">
                          Xem Hồ Sơ
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && (!filteredRanking || filteredRanking.length === 0) && (
            <div className="py-12 text-center">
              <Trophy className="w-12 h-12 text-outline/20 mx-auto mb-3" />
              <p className="text-on-surface-variant">Không tìm thấy thành viên nào</p>
            </div>
          )}

          {/* Show more / Load more */}
          {(filteredRanking?.length ?? 0) > 0 && (
            <div className="mt-6 flex items-center justify-center">
              {displayLimit < 100 && (
                <button
                  onClick={() => setDisplayLimit(displayLimit + 20)}
                  className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors font-semibold"
                >
                  Xem Thêm Thành Viên
                  <span className="material-symbols-outlined">expand_more</span>
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
