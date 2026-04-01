/**
 * PointsHistory — Lịch sử điểm
 *
 * Hiển thị: DataTable các giao dịch cộng/trừ điểm
 * Dùng: useQuery + pagination
 */

import { useState } from 'react';
import { useLoyaltyHistory } from '../hooks/useLoyalty';
import type { LoyaltyHistoryItem } from '../services/loyalty.service';

const ACTION_CONFIG: Record<
  string,
  { label: string; color: string; prefix: string }
> = {
  EARN: { label: 'Tích điểm', color: 'text-emerald-400', prefix: '+' },
  REDEEM: { label: 'Sử dụng', color: 'text-rose-400', prefix: '' },
  EXPIRE: { label: 'Hết hạn', color: 'text-gray-400', prefix: '' },
};

export default function PointsHistory() {
  const [page, setPage] = useState(1);
  const [filterAction, setFilterAction] = useState<string | undefined>();

  const { data: rawData, isLoading } = useLoyaltyHistory({
    page,
    limit: 10,
    action: filterAction,
  });

  const history: LoyaltyHistoryItem[] = (rawData as any)?.data?.data || [];
  const pagination = (rawData as any)?.data?.pagination;

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex gap-2">
        {[
          { key: undefined, label: 'Tất cả' },
          { key: 'EARN', label: '🟢 Tích điểm' },
          { key: 'REDEEM', label: '🔴 Sử dụng' },
          { key: 'EXPIRE', label: '⚪ Hết hạn' },
        ].map((tab) => (
          <button
            key={tab.key || 'all'}
            onClick={() => {
              setFilterAction(tab.key);
              setPage(1);
            }}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              filterAction === tab.key
                ? 'bg-rose-500/30 text-rose-100 border border-rose-500/40'
                : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-xl bg-white/5"
            />
          ))}
        </div>
      ) : history.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center text-white/50">
          <p className="text-lg mb-1">📭</p>
          <p className="text-sm">Chưa có lịch sử giao dịch điểm</p>
        </div>
      ) : (
        <div className="space-y-2">
          {history.map((item) => {
            const config = ACTION_CONFIG[item.action] || ACTION_CONFIG.EARN;
            return (
              <div
                key={item._id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-5 py-4 transition hover:bg-white/[0.08]"
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      item.action === 'EARN'
                        ? 'bg-emerald-500/20'
                        : item.action === 'REDEEM'
                          ? 'bg-rose-500/20'
                          : 'bg-gray-500/20'
                    }`}
                  >
                    <span className="text-lg">
                      {item.action === 'EARN'
                        ? '⬆️'
                        : item.action === 'REDEEM'
                          ? '⬇️'
                          : '⏳'}
                    </span>
                  </div>

                  {/* Info */}
                  <div>
                    <p className="text-sm font-semibold text-white/90">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wide ${
                          item.action === 'EARN'
                            ? 'text-emerald-400'
                            : item.action === 'REDEEM'
                              ? 'text-rose-400'
                              : 'text-gray-400'
                        }`}
                      >
                        {config.label}
                      </span>
                      <span className="text-white/30">·</span>
                      <span className="text-xs text-white/40">
                        {new Date(item.createdAt).toLocaleString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Points */}
                <span className={`text-lg font-bold ${config.color}`}>
                  {config.prefix}
                  {item.points.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/60 transition hover:bg-white/10 disabled:opacity-30"
          >
            ← Trước
          </button>
          <span className="flex items-center px-3 text-xs text-white/40">
            Trang {page} / {pagination.totalPages}
          </span>
          <button
            onClick={() =>
              setPage((p) => Math.min(pagination.totalPages, p + 1))
            }
            disabled={page >= pagination.totalPages}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/60 transition hover:bg-white/10 disabled:opacity-30"
          >
            Sau →
          </button>
        </div>
      )}
    </div>
  );
}
