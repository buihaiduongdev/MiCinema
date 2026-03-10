/**
 * API Response Types — dùng chung FE/BE
 * 
 * Export:
 * - ApiResponse<T> = { success: boolean; data: T; message?: string }
 * - PaginatedResponse<T> = ApiResponse<T[]> & { pagination: { page, limit, total, totalPages } }
 * - ApiError = { success: false; message: string; errors?: ZodError[] }
 */
