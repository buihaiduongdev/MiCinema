/**
 * Danh mục sản phẩm đồ ăn / nước uống / combo
 */
export const PRODUCT_CATEGORY = {
  POPCORN: 'POPCORN',
  DRINK: 'DRINK',
  COMBO: 'COMBO',
  OTHER: 'OTHER',
} as const;

export type ProductCategory =
  (typeof PRODUCT_CATEGORY)[keyof typeof PRODUCT_CATEGORY];
