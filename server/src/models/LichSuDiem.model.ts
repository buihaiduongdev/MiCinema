/**
 * LichSuDiem (Points History) — Mongoose Model
 * 
 * Schema fields:
 * - maTK: ObjectId, ref 'TaiKhoan', required
 * - soDiem: Number, required (dương = cộng, âm = trừ)
 * - loai: enum ['CONG_DIEM', 'DOI_DIEM', 'HET_HAN']
 * - moTa: String (vd: "Đặt vé phim Avengers", "Đổi điểm giảm 50k")
 * - maDatVe: ObjectId, ref 'DatVe' (optional)
 * 
 * Options: { timestamps: true }
 * Index: { maTK: 1, createdAt: -1 }
 */
