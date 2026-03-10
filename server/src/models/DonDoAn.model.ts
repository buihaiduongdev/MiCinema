/**
 * DonDoAn (Food Order) — Mongoose Model
 * 
 * Schema fields:
 * - maTK: ObjectId, ref 'TaiKhoan'
 * - maDatVe: ObjectId, ref 'DatVe' (optional — mua kèm vé hoặc mua riêng)
 * - items: [{ maSP: ObjectId, tenSP: String, soLuong: Number, donGia: Number }]
 * - tongTien: Number, required
 * - trangThai: enum ['CHO_THANH_TOAN', 'DA_THANH_TOAN', 'DA_HUY']
 */
