import apiClient from '@/lib/api-client';
import type {
  ApiResponse,
  AuthResponseData,
  LoginInput,
  RegisterInput,
  User,
} from '@shared/index';

export const loginApi = (
  data: LoginInput,
): Promise<ApiResponse<AuthResponseData>> =>
  apiClient.post('/auth/login', data);

export const registerApi = (
  data: RegisterInput,
): Promise<ApiResponse<AuthResponseData>> =>
  apiClient.post('/auth/register', data);

export const getMeApi = (): Promise<ApiResponse<{ user: User }>> =>
  apiClient.get('/auth/me');
