import z from 'zod';
import { PRODUCT_CATEGORY } from '../constants/food-constants.js';
import { objectIdSchema, paginationSchema } from './common.schema.js';

export const comboItemInputSchema = z.object({
  productId: objectIdSchema,
  quantity: z.number().int().min(1, 'Số lượng tối thiểu là 1'),
});

export type ComboItemInput = z.infer<typeof comboItemInputSchema>;

/** UC-46: chỉ thêm sản phẩm lẻ (không phải combo) */
export const createProductSchema = z.object({
  name: z.string().trim().min(1, 'Tên sản phẩm là bắt buộc').max(200),
  price: z.number().min(0, 'Giá không được âm'),
  image: z.string().trim().min(1, 'Ảnh là bắt buộc').max(2000),
  category: z
    .nativeEnum(PRODUCT_CATEGORY)
    .refine((c) => c !== PRODUCT_CATEGORY.COMBO, {
      message: 'Sản phẩm combo được quản lý ở mục Combo (UC-48)',
    }),
  description: z.string().trim().max(2000).optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

/** UC-48: tạo combo */
export const createComboSchema = z.object({
  name: z.string().trim().min(1, 'Tên combo là bắt buộc').max(200),
  price: z.number().min(0, 'Giá không được âm'),
  image: z.string().trim().min(1, 'Ảnh là bắt buộc').max(2000),
  comboItems: z
    .array(comboItemInputSchema)
    .min(1, 'Combo cần ít nhất một thành phần'),
  discountPercent: z.union([z.number().min(0).max(100), z.null()]).optional(),
  description: z.string().trim().max(2000).optional(),
});

export type CreateComboInput = z.infer<typeof createComboSchema>;

/** UC-47 / UC-48: cập nhật — service kiểm tra combo vs lẻ */
export const patchProductSchema = z
  .object({
    name: z.string().trim().min(1).max(200).optional(),
    price: z.number().min(0).optional(),
    image: z.string().trim().min(1).max(2000).optional(),
    description: z.string().trim().max(2000).optional(),
    isActive: z.boolean().optional(),
    comboItems: z.array(comboItemInputSchema).min(1).optional(),
    discountPercent: z.union([z.number().min(0).max(100), z.null()]).optional(),
  })
  .strict()
  .refine(
    (d) =>
      d.name !== undefined ||
      d.price !== undefined ||
      d.image !== undefined ||
      d.description !== undefined ||
      d.isActive !== undefined ||
      d.comboItems !== undefined ||
      d.discountPercent !== undefined,
    { message: 'Cần ít nhất một trường cập nhật' },
  );

export type PatchProductInput = z.infer<typeof patchProductSchema>;

/** Admin cần tải nhiều sản phẩm lẻ cho dropdown combo — limit > 100 so với pagination mặc định */
export const productListQuerySchema = paginationSchema
  .omit({ limit: true })
  .extend({
    limit: z.coerce.number().min(1).max(200).default(10),
    category: z.nativeEnum(PRODUCT_CATEGORY).optional(),
    /** retail = không COMBO; combo = chỉ COMBO; all = mặc định (hoặc lọc category) */
    kind: z.enum(['retail', 'combo', 'all']).optional(),
  });

export type ProductListQuery = z.infer<typeof productListQuerySchema>;

export const productIdParamsSchema = z.object({
  id: z
    .string()
    .trim()
    .regex(/^[a-fA-F0-9]{24}$/, 'ID sản phẩm không hợp lệ'),
});

/** UC-49: danh sách đơn đồ ăn theo suất chiếu */
export const foodOrderListQuerySchema = paginationSchema.extend({
  showtimeId: objectIdSchema,
});

export type FoodOrderListQuery = z.infer<typeof foodOrderListQuerySchema>;

export const orderItemInputSchema = z.object({
  productId: objectIdSchema,
  quantity: z.number().int().min(1, 'Số lượng tối thiếu là 1'),
});

export const createFoodOrderSchema = z.object({
  bookingId: objectIdSchema,
  items: z.array(orderItemInputSchema).min(1, 'Bạn cần ít nhất 1 sản phẩm'),
});

export type OrderItemInput = z.infer<typeof orderItemInputSchema>;
export type CreateFoodOrderInput = z.infer<typeof createFoodOrderSchema>;
