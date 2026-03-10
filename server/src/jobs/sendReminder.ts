/**
 * Cron Job — Nhắc lịch chiếu
 * 
 * Dùng: node-cron, schedule: '0 * * * *' (mỗi giờ)
 * 
 * Logic:
 * 1. Tìm DatVe có suất chiếu trong 2 giờ tới + trangThai = 'DA_THANH_TOAN'
 * 2. Gửi email nhắc nhở qua Nodemailer
 */
