import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import type { IProduct, ProductCategory } from '@/types/product';

interface UseFoodMenuOptions {
  category?: ProductCategory;
  isActive?: boolean;
}

export function useFoodMenu(options: UseFoodMenuOptions = {}) {
  const { category, isActive = true } = options;

  return useQuery({
    queryKey: ['products', { category, isActive }],
    queryFn: () => {
      const params = new URLSearchParams();
      if (isActive !== undefined) params.append('isActive', String(isActive));
      if (category) params.append('category', category);

      return apiClient.get(`/products?${params.toString()}`);
    },
    staleTime: 60000,
  });
}
