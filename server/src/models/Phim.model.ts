/**
 * Phim (Movie) — Mongoose Model
 * 
 * Schema fields:
 * - tenPhim: String, required, maxlength 255
 * - moTa: String
 * - daoDien: String, maxlength 100
 * - dienVien: [String]
 * - theLoai: [String]
 * - thoiLuong: Number, required (phút)
 * - ngayKhoiChieu: Date, required
 * - ngayKetThuc: Date
 * - poster: String
 * - trailer: String
 * - danhGia: Number, default 0, min 0, max 10
 * - trangThai: enum ['SAP_CHIEU', 'DANG_CHIEU', 'NGUNG_CHIEU'], default 'SAP_CHIEU'
 * 
 * Options: { timestamps: true }
 */
