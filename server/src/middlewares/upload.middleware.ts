/**
 * Upload Middleware — Multer Config
 *
 * Dùng: multer({ storage, fileFilter, limits })
 *
 * Export:
 * - uploadPoster: multer.single('poster') — upload poster phim
 * - uploadAvatar: multer.single('avatar') — upload avatar user
 * - uploadFoodImage: multer.single('anhSP') — upload ảnh đồ ăn
 *
 * Storage: disk hoặc memory (tuỳ deploy strategy)
 * Limits: maxFileSize 5MB, allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
 */
