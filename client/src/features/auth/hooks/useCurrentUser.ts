import { useQuery } from '@tanstack/react-query';
import { getMeApi } from '../services/auth.service';

export function useCurrentUser() {
  return useQuery({
    queryKey: ['me'],
    /** GET /auth/me: interceptor trả về trực tiếp user trong data */
    queryFn: () => getMeApi(),
    enabled: !!localStorage.getItem('accessToken'),
    staleTime: 4 * 60 * 1000,
  });
}
