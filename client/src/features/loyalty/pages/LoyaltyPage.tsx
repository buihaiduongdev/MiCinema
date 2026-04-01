/**
 * LoyaltyPage — Trang tích điểm thành viên (standalone)
 *
 * Compose: <PointsSummary /> + <PointsHistory />
 * Route: /loyalty (nếu muốn dùng trang riêng)
 */

import PointsSummary from '../components/PointsSummary';
import PointsHistory from '../components/PointsHistory';
import Navbar from '@/components/layout/Navbar';

export default function LoyaltyPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-black mb-8">⭐ Chương trình tích điểm</h1>
        <PointsSummary />
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">Lịch sử giao dịch</h2>
          <PointsHistory />
        </div>
      </div>
    </div>
  );
}
