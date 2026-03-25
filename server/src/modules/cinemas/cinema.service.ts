/**
 * Cinema Service — CRUD Chi nhánh rạp
 *
 * Dùng: Mongoose models từ models/
 * Export các function: create, getAll, getById, getBySlug, update, remove, getCities
 */

import { Cinema } from '../../models/Cinema.model.js';
import { getSkip, getPaginationData } from '../../utils/pagination.js';
import { slugify } from '../../utils/slugify.js';
import type {
  CreateCinemaInput,
  UpdateCinemaInput,
  CinemaFilter,
} from '@shared/schemas/cinema.schema';

/**
 * Tạo chi nhánh rạp mới
 */
export const create = async (data: CreateCinemaInput) => {
  const slug = slugify(data.name);

  const existing = await Cinema.findOne({
    $or: [{ name: data.name }, { slug }],
  });
  if (existing) {
    throw new Error(`Chi nhánh "${data.name}" đã tồn tại`);
  }

  const cinema = await Cinema.create({ ...data, slug });
  return cinema;
};

/**
 * Lấy danh sách chi nhánh có phân trang + lọc theo city
 */
export const getAll = async (filter: CinemaFilter) => {
  const { page, limit, search, city } = filter;

  const query: any = { isActive: true };

  if (search) {
    query.$text = { $search: search };
  }
  if (city) {
    query.city = city;
  }

  const totalItems = await Cinema.countDocuments(query);
  const skip = getSkip(page, limit);

  const data = await Cinema.find(query)
    .sort({ city: 1, name: 1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const pagination = getPaginationData(totalItems, page, limit);

  return { data, pagination };
};

/**
 * Lấy chi tiết chi nhánh theo ID
 */
export const getById = async (id: string) => {
  const cinema = await Cinema.findById(id).lean();
  if (!cinema) throw new Error('Không tìm thấy chi nhánh');
  return cinema;
};

/**
 * Lấy chi tiết chi nhánh theo slug
 */
export const getBySlug = async (slug: string) => {
  const cinema = await Cinema.findOne({ slug }).lean();
  if (!cinema) throw new Error('Không tìm thấy chi nhánh');
  return cinema;
};

/**
 * Cập nhật chi nhánh
 */
export const update = async (id: string, data: UpdateCinemaInput) => {
  const updateData: any = { ...data };

  if (data.name) {
    updateData.slug = slugify(data.name);

    const existing = await Cinema.findOne({
      $or: [{ name: data.name }, { slug: updateData.slug }],
      _id: { $ne: id },
    });
    if (existing) {
      throw new Error(`Chi nhánh "${data.name}" đã tồn tại`);
    }
  }

  const updated = await Cinema.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).lean();

  if (!updated) throw new Error('Không tìm thấy chi nhánh');
  return updated;
};

/**
 * Xóa chi nhánh (soft delete)
 */
export const remove = async (id: string) => {
  const cinema = await Cinema.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true },
  );
  if (!cinema) throw new Error('Không tìm thấy chi nhánh');
  return cinema;
};

/**
 * Lấy danh sách tất cả thành phố có chi nhánh (cho dropdown filter)
 */
export const getCities = async () => {
  const cities = await Cinema.distinct('city', { isActive: true });
  return cities.sort();
};
