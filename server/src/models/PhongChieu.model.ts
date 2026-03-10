/**
 * PhongChieu (Room) — Mongoose Model
 * 
 * Ghế được EMBED trực tiếp trong phòng (nested document):
 * 
 * gheSchema (sub-document):
 * - hang: String (A, B, C...)
 * - cot: Number
 * - loaiGhe: enum ['THUONG', 'VIP', 'SWEETBOX'], default 'THUONG'
 * - trangThai: Boolean, default true
 * 
 * phongChieuSchema:
 * - tenPhong: String, required, unique
 * - soHang: Number, required
 * - soCotMoiHang: Number, required
 * - loaiPhong: enum ['THUONG', 'VIP', 'IMAX', 'FOUR_DX'], default 'THUONG'
 * - trangThai: Boolean, default true
 * - danhSachGhe: [gheSchema] ← embedded array
 */
