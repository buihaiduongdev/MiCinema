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

export const getMeApi = (): Promise<ApiResponse<User>> =>
  apiClient.get('/auth/me');

export const updateMeApi = (
  data: Partial<Pick<User, 'fullName' | 'phone' | 'avatar'>>,
): Promise<ApiResponse<User>> => apiClient.patch('/auth/me', data);
