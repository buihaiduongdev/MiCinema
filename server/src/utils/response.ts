import { ApiResponse } from '@shared/types/api.type';

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
