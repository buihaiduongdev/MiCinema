/**
 * DatVe (Booking) — Mongoose Model
 * 
 * ChiTietDatVe EMBED trong DatVe (nested document):
 * 
 * chiTietDatVeSchema (sub-document):
 * - maGhe: ObjectId (ref đến _id ghế trong PhongChieu.danhSachGhe)
 * - hang: String (denormalize để hiển thị nhanh)
 * - cot: Number (denormalize)
 * - loaiGhe: String (denormalize)
 * - giaVe: Number
 * 
 * datVeSchema:
 * - maTK: ObjectId, ref 'TaiKhoan', required
 * - maXuatChieu: ObjectId, ref 'XuatChieu', required
 * - tongTien: Number, required
 * - trangThai: enum ['CHO_THANH_TOAN', 'DA_THANH_TOAN', 'DA_HUY', 'DA_SU_DUNG']
 * - phuongThucTT: String
 * - chiTiet: [chiTietDatVeSchema] ← embedded
 * - hetHanGiuGhe: Date (thời điểm hết hạn giữ ghế 10 phút)
 * - maDatVe: String (mã để tra cứu tại quầy — auto generate)
 * 
 * Indexes:
 * - { maTK: 1, createdAt: -1 }
 * - { maXuatChieu: 1 }
 * - { hetHanGiuGhe: 1, trangThai: 1 } — cho cron job
 * - { maDatVe: 1 } — tra cứu nhanh
 */
