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

import { ApiResponse } from '@shared/schemas/api.type';

export const responseSuccess = <T>(
  data: T,
  message = 'Thành công',
): ApiResponse<T> => ({
  success: true,
  data,
  message,
});

export const responseError = (
  message: string,
  error?: any,
): ApiResponse<null> => ({
  success: false,
  data: null,
  message,
  error,
});
