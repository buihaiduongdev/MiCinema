/**
 * Response Helpers — Standard format
 *
 * Export:
 * - sendSuccess(res, data, message?, statusCode = 200)
 *   → { success: true, data, message }
 *
 * - sendError(res, message, statusCode = 500, errors?)
 *   → { success: false, message, errors }
 *
 * - sendPaginated(res, data, pagination: { page, limit, total })
 *   → { success: true, data, pagination: { page, limit, total, totalPages } }
 */
