/**
 * Cron Job — Cập nhật trạng thái tự động
 *
 * Dùng: node-cron, schedule: '0 0 * * *' (mỗi ngày 0h)
 *
 * Logic:
 * 1. Phim: SAP_CHIEU → DANG_CHIEU (nếu ngayKhoiChieu <= today)
 * 2. Phim: DANG_CHIEU → NGUNG_CHIEU (nếu ngayKetThuc < today)
 * 3. XuatChieu: MO_BAN → DA_CHIEU (nếu gioChieu < now)
 */
