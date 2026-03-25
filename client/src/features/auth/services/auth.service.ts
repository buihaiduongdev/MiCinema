import apiClient from '@/lib/api-client';
import type { AuthResponseData, LoginInput, RegisterInput, User } from '@shared/index';

/** Interceptor trả về `data` trong ApiResponse */
export const loginApi = (data: LoginInput): Promise<AuthResponseData> =>
  apiClient.post('/auth/login', data);

export const registerApi = (data: RegisterInput): Promise<AuthResponseData> =>
  apiClient.post('/auth/register', data);

/** Sau interceptor axios, body = user (data gốc từ API) */
export const getMeApi = (): Promise<User> => apiClient.get('/auth/me');
