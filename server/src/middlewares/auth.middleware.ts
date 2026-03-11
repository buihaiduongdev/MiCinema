/**
 * Auth Middleware — JWT Verify + Role Check
 *
 * authMiddleware: (req, res, next)
 * - Lấy token từ header: Authorization: Bearer <token>
 * - jwt.verify(token, JWT_SECRET) → decode payload
 * - Gắn req.user = { _id, email, vaiTro }
 * - 401 nếu không có token hoặc token hết hạn
 *
 * roleGuard(allowedRoles: string[]): middleware factory
 * - Kiểm tra req.user.vaiTro có nằm trong allowedRoles
 * - 403 nếu không có quyền
 */
