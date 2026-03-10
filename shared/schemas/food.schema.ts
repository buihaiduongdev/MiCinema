/**
 * Food & Beverage Validation Schemas (Zod)
 * 
 * Export:
 * - createProductSchema: z.object({ tenSP, giaSP, anhSP?, danhMuc, moTa? })
 * - createComboSchema: z.object({ tenCombo, danhSachSP: z.array(), giaCombo, giamGia? })
 * - orderFoodSchema: z.object({ items: z.array({ maSP, soLuong }) })
 * 
 * Type exports:
 * - CreateProductInput, CreateComboInput, OrderFoodInput
 */
