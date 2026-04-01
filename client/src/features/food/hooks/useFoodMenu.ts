import type { ProductListQuery } from '@shared/index';
import { useQuery } from '@tanstack/react-query';
import { getProductApi } from '../services/food.service';

export const useFoodMenu = (query?: ProductListQuery) => {
  return useQuery({
    queryKey: ['food-menu', query],
    queryFn: async () => (await getProductApi(query)).data,
    staleTime: 1000 * 60 * 5,
  });
};
