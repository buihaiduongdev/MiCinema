import { useQuery } from '@tanstack/react-query';
import { getMeApi } from '../services/auth.service';

export function useCurrentUser() {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => getMeApi().then((res) => res.data),
    enabled: !!localStorage.getItem('accessToken'),
    staleTime: 4 * 60 * 1000,
  });
}
