/**
 * TaiKhoan (User Account) — Mongoose Model
 * 
 * Schema fields:
 * - email: String, required, unique
 * - matKhau: String, required (bcrypt hash)
 * - hoTen: String, required, maxlength 100
 * - soDienThoai: String, maxlength 20
 * - avatar: String
 * - vaiTro: enum ['ADMIN', 'NHAN_VIEN', 'KHACH_HANG'], default 'KHACH_HANG'
 * - trangThai: Boolean, default true
 * - diemTichLuy: Number, default 0
 * - hangThanhVien: enum ['BRONZE', 'SILVER', 'GOLD'], default 'BRONZE'
 * 
 * Options: { timestamps: true } → auto createdAt, updatedAt
 * 
 * Pre-save hook: hash password nếu isModified('matKhau')
 * Method: comparePassword(candidatePassword) → bcrypt.compare
 */
