/**
 * Genre Service — CRUD Thể loại phim
 *
 * Dùng: Mongoose models từ models/
 * Tách business logic ra khỏi controller
 * Export các function: create, getAll, getById, update, remove
 */

import { Genre } from '../../models/Genre.model.js';
import { slugify } from '../../utils/slugify.js';
import type {
  CreateGenreInput,
  UpdateGenreInput,
} from '@shared/schemas/genre.schema';

/**
 * Tạo mới Genre
 */
export const create = async (data: CreateGenreInput) => {
  const slug = slugify(data.name);

  // Kiểm tra trùng tên hoặc slug
  const existing = await Genre.findOne({
    $or: [{ name: data.name }, { slug }],
  });
  if (existing) {
    throw new Error(`Thể loại "${data.name}" đã tồn tại`);
  }

  const genre = await Genre.create({ ...data, slug });
  return genre;
};

/**
 * Lấy tất cả Genre (không phân trang — thường ít dữ liệu)
 */
export const getAll = async () => {
  const data = await Genre.find({ isActive: true })
    .sort({ name: 1 })
    .lean();
  return data;
};

/**
 * Lấy chi tiết Genre theo ID
 */
export const getById = async (id: string) => {
  const genre = await Genre.findById(id).lean();
  if (!genre) throw new Error('Không tìm thấy thể loại');
  return genre;
};

/**
 * Cập nhật Genre
 */
export const update = async (id: string, data: UpdateGenreInput) => {
  const updateData: any = { ...data };

  // Nếu đổi tên → tạo slug mới + kiểm tra trùng
  if (data.name) {
    updateData.slug = slugify(data.name);

    const existing = await Genre.findOne({
      $or: [{ name: data.name }, { slug: updateData.slug }],
      _id: { $ne: id },
    });
    if (existing) {
      throw new Error(`Thể loại "${data.name}" đã tồn tại`);
    }
  }

  const updated = await Genre.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).lean();

  if (!updated) throw new Error('Không tìm thấy thể loại');
  return updated;
};

/**
 * Xóa Genre (soft delete)
 */
export const remove = async (id: string) => {
  const genre = await Genre.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true },
  );
  if (!genre) throw new Error('Không tìm thấy thể loại');
  return genre;
};
