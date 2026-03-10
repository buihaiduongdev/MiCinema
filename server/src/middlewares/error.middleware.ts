/**
 * Error Handler Middleware — Global
 * 
 * Đặt CUỐI CÙNG trong middleware chain: app.use(errorHandler)
 * 
 * Xử lý:
 * - Mongoose ValidationError → 400
 * - Mongoose CastError (invalid ObjectId) → 400
 * - JsonWebTokenError → 401
 * - Custom AppError → status tương ứng
 * - Còn lại → 500 Internal Server Error
 * 
 * Format response: { success: false, message, errors? }
 */
