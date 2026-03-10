/**
 * XuatChieu (Showtime) — Mongoose Model
 * 
 * Schema fields:
 * - maPhim: ObjectId, ref 'Phim', required
 * - maPhong: ObjectId, ref 'PhongChieu', required
 * - gioChieu: Date, required
 * - giaVe: Number, required (VND)
 * - trangThai: enum ['MO_BAN', 'DA_CHIEU', 'HUY'], default 'MO_BAN'
 * 
 * Indexes:
 * - { maPhim: 1, gioChieu: 1 } — tìm suất chiếu theo phim + ngày
 * - { maPhong: 1, gioChieu: 1 } — tránh trùng phòng cùng giờ
 */
