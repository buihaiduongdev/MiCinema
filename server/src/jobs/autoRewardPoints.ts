/**
 * Cron Job — Tự động cộng điểm + nâng hạng
 * 
 * Có thể chạy real-time (sau payment success) hoặc cron
 * 
 * Logic:
 * 1. Sau thanh toán: tính điểm = tongTien / tiLeDiem
 * 2. Cập nhật TaiKhoan.diemTichLuy += điểm
 * 3. Kiểm tra hạng: diemTichLuy >= ngưỡng → nâng hạng
 * 4. Tạo record LichSuDiem
 */
