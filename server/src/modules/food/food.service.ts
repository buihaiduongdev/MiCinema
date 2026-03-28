import mongoose from 'mongoose';
import type { Document, Filter } from 'mongodb';
import { PRODUCT_CATEGORY } from '@shared/constants/food-constants.js';
import { Product } from '../../models/Product.model.js';
import { FoodOrder } from '../../models/FoodOrder.model.js';
import { Showtime } from '../../models/Showtime.model.js';
import { getSkip, getPaginationData } from '../../utils/pagination.js';
import type {
  CreateComboInput,
  CreateProductInput,
  FoodOrderListQuery,
  PatchProductInput,
  ProductListQuery,
} from '@shared/schemas/food.schema.js';

const httpError = (message: string, statusCode: number) => {
  const e = new Error(message) as Error & { statusCode: number };
  e.statusCode = statusCode;
  return e;
};

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Một số bản ghi (import/JSON) có thể lưu `_id` là chuỗi hex; `findById` chỉ so với ObjectId → 404 dù list vẫn thấy.
 * Tra cứu qua driver thô để khớp cả hai kiểu.
 */
async function resolveProductDbId(
  id: string,
): Promise<mongoose.Types.ObjectId | string | null> {
  const oid = new mongoose.Types.ObjectId(id);
  const raw = await Product.collection.findOne({
    $or: [{ _id: oid }, { _id: id }],
  } as unknown as Filter<Document>);
  return raw?._id ?? null;
}

async function assertRetailComponents(
  items: { productId: string; quantity: number }[],
) {
  const ids = [...new Set(items.map((i) => i.productId))];
  const products = await Product.find({ _id: { $in: ids } }).select('category');
  if (products.length !== ids.length) {
    throw httpError('Một số sản phẩm thành phần không tồn tại', 400);
  }
  for (const p of products) {
    if (p.category === PRODUCT_CATEGORY.COMBO) {
      throw httpError('Combo không được chứa sản phẩm combo khác', 400);
    }
  }
}

/** UC-46 */
export const createProduct = async (data: CreateProductInput) => {
  const nameTrim = data.name.trim();
  const dup = await Product.findOne({
    name: { $regex: new RegExp(`^${escapeRegex(nameTrim)}$`, 'i') },
  });
  if (dup) {
    throw httpError('Đã có sản phẩm cùng tên', 409);
  }

  const product = await Product.create({
    name: nameTrim,
    price: data.price,
    image: data.image.trim(),
    category: data.category,
    description: data.description?.trim() ?? '',
    isActive: true,
  });

  return product.toObject();
};

/** UC-48 */
export const createCombo = async (data: CreateComboInput) => {
  await assertRetailComponents(data.comboItems);
  const nameTrim = data.name.trim();
  const dup = await Product.findOne({
    name: { $regex: new RegExp(`^${escapeRegex(nameTrim)}$`, 'i') },
  });
  if (dup) {
    throw httpError('Đã có sản phẩm cùng tên', 409);
  }

  const product = await Product.create({
    name: nameTrim,
    price: data.price,
    image: data.image.trim(),
    category: PRODUCT_CATEGORY.COMBO,
    description: data.description?.trim() ?? '',
    isActive: true,
    comboItems: data.comboItems.map((c) => ({
      productId: new mongoose.Types.ObjectId(c.productId),
      quantity: c.quantity,
    })),
    discountPercent:
      data.discountPercent === undefined ? null : data.discountPercent,
  });

  return getProductById(product._id.toString());
};

export const listProducts = async (query: ProductListQuery) => {
  const { page, limit, category, kind } = query;
  const filter: Record<string, unknown> = {};
  if (category) {
    filter.category = category;
  } else if (kind === 'retail') {
    filter.category = { $ne: PRODUCT_CATEGORY.COMBO };
  } else if (kind === 'combo') {
    filter.category = PRODUCT_CATEGORY.COMBO;
  }

  const totalItems = await Product.countDocuments(filter);
  const skip = getSkip(page, limit);
  const data = await Product.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const pagination = getPaginationData(totalItems, page, limit);
  return { data, pagination };
};

export const getProductById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw httpError('ID sản phẩm không hợp lệ', 400);
  }
  const rid = await resolveProductDbId(id);
  if (!rid) throw httpError('Không tìm thấy sản phẩm', 404);
  const product = await Product.findOne({ _id: rid })
    .populate({
      path: 'comboItems.productId',
      select: 'name price category image',
    })
    .lean();
  if (!product) throw httpError('Không tìm thấy sản phẩm', 404);
  return product;
};

/** UC-47 / UC-48 */
export const updateProduct = async (id: string, data: PatchProductInput) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw httpError('ID sản phẩm không hợp lệ', 400);
  }
  const rid = await resolveProductDbId(id);
  if (!rid) throw httpError('Không tìm thấy sản phẩm', 404);
  const product = await Product.findOne({ _id: rid });
  if (!product) throw httpError('Không tìm thấy sản phẩm', 404);

  const isCombo = product.category === PRODUCT_CATEGORY.COMBO;

  if (!isCombo) {
    if (data.comboItems !== undefined || data.discountPercent !== undefined) {
      throw httpError('Sản phẩm lẻ không có cấu hình combo', 400);
    }
  }

  if (data.comboItems !== undefined) {
    await assertRetailComponents(data.comboItems);
    product.comboItems = data.comboItems.map((c) => ({
      productId: new mongoose.Types.ObjectId(c.productId),
      quantity: c.quantity,
    }));
    product.markModified('comboItems');
  }

  if (data.discountPercent !== undefined) {
    product.discountPercent = data.discountPercent;
  }

  if (data.name !== undefined) {
    const nameTrim = data.name.trim();
    const dup = await Product.findOne({
      name: { $regex: new RegExp(`^${escapeRegex(nameTrim)}$`, 'i') },
      _id: { $ne: product._id },
    });
    if (dup) throw httpError('Đã có sản phẩm cùng tên', 409);
    product.name = nameTrim;
  }
  if (data.price !== undefined) product.price = data.price;
  if (data.image !== undefined) product.image = data.image.trim();
  if (data.description !== undefined) product.description = data.description.trim();
  if (data.isActive !== undefined) product.isActive = data.isActive;

  await product.save();
  return getProductById(id);
};

/** UC-47: ẩn sản phẩm (không xóa cứng) */
export const deactivateProduct = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw httpError('ID sản phẩm không hợp lệ', 400);
  }
  const rid = await resolveProductDbId(id);
  if (!rid) throw httpError('Không tìm thấy sản phẩm', 404);
  const product = await Product.findOne({ _id: rid });
  if (!product) throw httpError('Không tìm thấy sản phẩm', 404);
  product.isActive = false;
  await product.save();
  return product.toObject();
};

/** UC-49 */
export const listFoodOrdersByShowtime = async (query: FoodOrderListQuery) => {
  const { showtimeId, page, limit } = query;
  if (!mongoose.Types.ObjectId.isValid(showtimeId)) {
    throw httpError('ID suất chiếu không hợp lệ', 400);
  }
  const st = await Showtime.findById(showtimeId).select('_id').lean();
  if (!st) throw httpError('Không tìm thấy suất chiếu', 404);

  const filter = { showtimeId };
  const totalItems = await FoodOrder.countDocuments(filter);
  const skip = getSkip(page, limit);
  const data = await FoodOrder.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('userId', 'email fullName')
    .lean();

  const pagination = getPaginationData(totalItems, page, limit);
  return { data, pagination };
};
