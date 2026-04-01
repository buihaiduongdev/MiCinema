/**
 * PointsSummary — Tóm tắt điểm tích luỹ
 *
 * Hiển thị: tổng điểm, hạng thành viên, tiến trình lên hạng tiếp
 */

import { Progress } from '@mantine/core';
import { useLoyaltySummary } from '../hooks/useLoyalty';
import type { LoyaltySummary } from '../services/loyalty.service';

const TIER_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  BRONZE: { bg: 'from-amber-700/40 to-amber-900/30', text: 'text-amber-300', icon: '🥉' },
  SILVER: { bg: 'from-slate-400/40 to-slate-600/30', text: 'text-slate-200', icon: '🥈' },
  GOLD: { bg: 'from-yellow-500/40 to-yellow-700/30', text: 'text-yellow-200', icon: '🥇' },
};

export default function PointsSummary() {
  const { data: rawData, isLoading } = useLoyaltySummary();
  const summary: LoyaltySummary | null = (rawData as any)?.data || null;

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-40 rounded-2xl bg-white/5" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-white/50">
        Không thể tải thông tin tích điểm
      </div>
    );
  }

  const tier = TIER_COLORS[summary.membershipTier] || TIER_COLORS.BRONZE;

  return (
    <div className="space-y-6">
      {/* Card hạng thành viên */}
      <div
        className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${tier.bg} p-6`}
      >
        {/* Decorative circles */}
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5" />
        <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-white/5" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-1">
                Hạng thành viên
              </p>
              <div className="flex items-center gap-2">
                <span className="text-3xl">{tier.icon}</span>
                <h2 className={`text-2xl font-black ${tier.text}`}>
                  {summary.membershipTier}
                </h2>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/50 mb-1">Điểm hiện tại</p>
              <p className="text-3xl font-black text-white">
                {summary.loyaltyPoints.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Tiến trình lên hạng */}
          {summary.nextTier && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-white/60 mb-2">
                <span>Tiến trình lên {summary.nextTier}</span>
                <span>
                  Còn {summary.pointsToNextTier.toLocaleString()} điểm
                </span>
              </div>
              <Progress
                value={summary.progressPercent}
                color="yellow"
                size="sm"
                className="mb-1"
              />
              <p className="text-right text-xs text-white/40">
                {summary.progressPercent}%
              </p>
            </div>
          )}
          {!summary.nextTier && (
            <p className="mt-4 text-sm text-yellow-200/70 italic">
              ✨ Bạn đã đạt hạng cao nhất!
            </p>
          )}
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-wider text-white/50 mb-2">
            Tổng điểm đã kiếm
          </p>
          <p className="text-2xl font-bold text-emerald-400">
            +{summary.totalEarned.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-wider text-white/50 mb-2">
            Điểm đã sử dụng
          </p>
          <p className="text-2xl font-bold text-rose-400">
            -{summary.totalRedeemed.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-wider text-white/50 mb-2">
            Điểm khả dụng
          </p>
          <p className="text-2xl font-bold text-white">
            {summary.loyaltyPoints.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Hướng dẫn tích điểm */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <h3 className="text-sm font-bold mb-3 text-white/80">
          📋 Cách tích điểm
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <div className="flex items-start gap-2 text-white/60">
            <span className="text-emerald-400 mt-0.5">🎬</span>
            <span>Mua vé xem phim: <strong className="text-white/80">+10 điểm/vé</strong></span>
          </div>
          <div className="flex items-start gap-2 text-white/60">
            <span className="text-emerald-400 mt-0.5">🍿</span>
            <span>Mua đồ ăn: <strong className="text-white/80">+5 điểm/đơn</strong></span>
          </div>
          <div className="flex items-start gap-2 text-white/60">
            <span className="text-emerald-400 mt-0.5">⭐</span>
            <span>Viết đánh giá: <strong className="text-white/80">+3 điểm</strong></span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-white/10 text-xs text-white/40">
          Ngưỡng nâng hạng: Bronze (0) → Silver (500đ) → Gold (2000đ)
        </div>
      </div>
    </div>
  );
}
