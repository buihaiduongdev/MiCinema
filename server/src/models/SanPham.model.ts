/**
 * SanPham (Food Product) — Mongoose Model
 * 
 * Schema fields:
 * - tenSP: String, required
 * - giaSP: Number, required
 * - anhSP: String
 * - danhMuc: enum ['BAP', 'NUOC', 'COMBO', 'KHAC'], required
 * - moTa: String
 * - trangThai: Boolean, default true
 * - danhSachSP: [{ maSP: ObjectId, soLuong: Number }] — chỉ dùng cho combo
 * - giamGia: Number — % giảm cho combo
 */
