import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../../lib/api-client';
import type { ApiResponse } from '@shared/types/api.type';
import type {
  CreateComboInput,
  CreateProductInput,
  PatchProductInput,
} from '@shared/schemas/food.schema';
import type { PaginationMeta } from '@shared/types/pagination.type';
import { FOOD_ORDER_STATUS } from '@shared/constants/statuses';

const OBJECT_ID_RE = /^[a-fA-F0-9]{24}$/;

/** Chuẩn hoá _id từ API (chuỗi, { $oid }, ObjectId-like) để URL /params luôn đúng 24 ký tự hex. */
export function normalizeMongoId(raw: unknown): string {
  if (raw == null) return '';
  if (typeof raw === 'string') {
    return raw.trim();
  }
  if (typeof raw === 'object' && raw !== null && '$oid' in raw) {
    const oid = (raw as { $oid: unknown }).$oid;
    return typeof oid === 'string' ? oid.trim() : '';
  }
  const s = String(raw);
  return OBJECT_ID_RE.test(s) ? s : s;
}

export type AdminProductRow = {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  isActive: boolean;
  comboItems?: { productId: string; quantity: number }[];
  discountPercent?: number | null;
  createdAt: string;
  updatedAt: string;
};

type ProductsListPayload = {
  data: AdminProductRow[];
  pagination: PaginationMeta;
};

export type ComboItemPopulated = {
  productId: {
    _id: string;
    name: string;
    price: number;
    category: string;
    image?: string;
  };
  quantity: number;
};

export type AdminProductDetail = AdminProductRow & {
  comboItems?: ComboItemPopulated[];
};

export function useAdminProducts(
  filter: {
    page: number;
    limit: number;
    category?: string;
    kind?: 'retail' | 'combo' | 'all';
  },
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ['admin-food-products', filter],
    queryFn: async (): Promise<ProductsListPayload> => {
      const res = (await apiClient.get('/food/products', {
        params: {
          page: filter.page,
          limit: filter.limit,
          ...(filter.category ? { category: filter.category } : {}),
          ...(filter.kind && filter.kind !== 'all'
            ? { kind: filter.kind }
            : {}),
        },
      })) as ApiResponse<ProductsListPayload>;
      return res.data;
    },
    enabled: options?.enabled ?? true,
  });
}

export function useProductById(id: string | undefined, enabled: boolean) {
  const pid = id ? normalizeMongoId(id) : '';
  return useQuery({
    queryKey: ['admin-food-product', pid],
    queryFn: async (): Promise<AdminProductDetail> => {
      const res = (await apiClient.get(
        `/food/products/${pid}`,
      )) as ApiResponse<AdminProductDetail>;
      return res.data;
    },
    enabled: enabled && !!pid && OBJECT_ID_RE.test(pid),
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateProductInput) => {
      return apiClient.post<ApiResponse<AdminProductRow>>(
        '/food/products',
        body,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-food-products'] });
    },
  });
}

export function useCreateCombo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateComboInput) => {
      return apiClient.post<ApiResponse<AdminProductDetail>>(
        '/food/combos',
        body,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-food-products'] });
    },
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      body,
    }: {
      id: string;
      body: PatchProductInput;
    }) => {
      const pid = normalizeMongoId(id);
      if (!OBJECT_ID_RE.test(pid)) {
        throw new Error('ID sản phẩm không hợp lệ');
      }
      return apiClient.put(`/food/products/${pid}`, body);
    },
    onSuccess: (_, { id }) => {
      const pid = normalizeMongoId(id);
      qc.invalidateQueries({ queryKey: ['admin-food-products'] });
      qc.invalidateQueries({ queryKey: ['admin-food-product', pid] });
    },
  });
}

/** Ẩn sản phẩm — PUT { isActive: false } (tránh PATCH/DELETE bị proxy chặn). */
export function useDeactivateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const pid = normalizeMongoId(id);
      if (!OBJECT_ID_RE.test(pid)) {
        throw new Error('ID sản phẩm không hợp lệ');
      }
      return apiClient.put(`/food/products/${pid}`, { isActive: false });
    },
    onSuccess: (_, id) => {
      const pid = normalizeMongoId(id);
      qc.invalidateQueries({ queryKey: ['admin-food-products'] });
      qc.invalidateQueries({ queryKey: ['admin-food-product', pid] });
    },
  });
}

export type AdminFoodOrderRow = {
  _id: string;
  userId: { email: string; fullName: string } | string;
  showtimeId: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];
  totalAmount: number;
  status: string;
  createdAt: string;
};

type FoodOrdersPayload = {
  data: AdminFoodOrderRow[];
  pagination: PaginationMeta;
};

export function useAdminFoodOrders(
  showtimeId: string | null,
  page: number,
  limit: number,
) {
  return useQuery({
    queryKey: ['admin-food-orders', showtimeId, page, limit],
    queryFn: async (): Promise<FoodOrdersPayload> => {
      const res = (await apiClient.get('/food/orders', {
        params: { showtimeId, page, limit },
      })) as ApiResponse<FoodOrdersPayload>;
      return res.data;
    },
    enabled: !!showtimeId,
  });
}

export const FOOD_ORDER_STATUS_LABELS: Record<string, string> = {
  [FOOD_ORDER_STATUS.PENDING]: 'Chờ xử lý',
  [FOOD_ORDER_STATUS.PAID]: 'Đã thanh toán',
  [FOOD_ORDER_STATUS.CANCELLED]: 'Đã huỷ',
};

type ShowtimeOptionRow = {
  _id: string;
  startTime: string;
  movieId?: { title?: string };
  cinemaId?: { name?: string };
  roomId?: { name?: string };
};

export function useShowtimesForFoodSelect() {
  return useQuery({
    queryKey: ['admin-showtimes-food-select'],
    queryFn: async (): Promise<ShowtimeOptionRow[]> => {
      const res = (await apiClient.get('/showtimes', {
        params: {
          limit: 100,
          page: 1,
          sortBy: 'startTime',
          sortOrder: 'desc',
        },
      })) as ApiResponse<{ data: ShowtimeOptionRow[]; pagination: unknown }>;
      return res.data?.data ?? [];
    },
  });
}
