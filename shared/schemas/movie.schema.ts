/**
 * Movie Validation Schemas (Zod)
 * 
 * Export:
 * - createMovieSchema: z.object({ tenPhim, moTa?, daoDien?, dienVien?, theLoai[], thoiLuong, ngayKhoiChieu })
 * - updateMovieSchema: createMovieSchema.partial() — tất cả fields optional
 * - movieFilterSchema: z.object({ theLoai?, trangThai?, search?, page?, limit? })
 * 
 * Type exports:
 * - CreateMovieInput, UpdateMovieInput, MovieFilter
 */
