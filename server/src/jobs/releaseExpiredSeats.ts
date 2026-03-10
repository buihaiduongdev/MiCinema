/**
 * Cron Job — Giải phóng ghế hết hạn
 * 
 * Dùng: node-cron, schedule: '* * * * *' (mỗi phút)
 * 
 * Logic:
 * 1. Tìm DatVe có trangThai = 'CHO_THANH_TOAN' && hetHanGiuGhe < now
 * 2. Chuyển trangThai → 'DA_HUY'
 * 3. Log: "Released X expired bookings"
 */
