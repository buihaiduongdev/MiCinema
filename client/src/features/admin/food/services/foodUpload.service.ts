import apiClient from '@/lib/api-client';
import type { ApiResponse } from '@shared/types/api.type';

/** POST multipart → `/uploads/...` lưu trong DB trường `image` */
export async function uploadFoodProductImage(file: File): Promise<string> {
  const fd = new FormData();
  fd.append('image', file);
  const res = (await apiClient.post(
    '/food/upload-image',
    fd,
  )) as ApiResponse<{ url: string }>;
  if (!res.success || !res.data?.url) {
    throw new Error(res.message || 'Upload thất bại');
  }
  return res.data.url;
}
