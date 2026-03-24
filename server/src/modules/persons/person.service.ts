/**
 * Person Service — CRUD Actor/Director
 *
 * Dùng: Mongoose models từ models/
 * Tách business logic ra khỏi controller
 * Export các function: create, getAll, getById, update, remove
 * Xử lý: pagination (utils/pagination), error throwing
 */

import { Person } from '../../models/Person.model.js';
import { getSkip, getPaginationData } from '../../utils/pagination.js';
import type {
  CreatePersonInput,
  UpdatePersonInput,
  PersonFilter,
} from '@shared/schemas/person.schema';

/**
 * Tạo mới Person (Actor / Director)
 */
export const create = async (data: CreatePersonInput) => {
  // Kiểm tra trùng tên
  const existing = await Person.findOne({ name: data.name });
  if (existing) {
    throw new Error(`Người này đã tồn tại: ${data.name}`);
  }

  const person = await Person.create(data);
  return person;
};

/**
 * Lấy danh sách Person có phân trang + lọc
 */
export const getAll = async (filter: PersonFilter) => {
  const { page, limit, search, role, nationality } = filter;

  const query: any = { isActive: true };

  if (search) {
    query.$text = { $search: search };
  }
  if (role) {
    query.roles = role;
  }
  if (nationality) {
    query.nationality = nationality;
  }

  const totalItems = await Person.countDocuments(query);
  const skip = getSkip(page, limit);

  const data = await Person.find(query)
    .sort({ name: 1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const pagination = getPaginationData(totalItems, page, limit);

  return { data, pagination };
};

/**
 * Lấy chi tiết Person theo ID
 */
export const getById = async (id: string) => {
  const person = await Person.findById(id).lean();
  if (!person) throw new Error('Không tìm thấy người này');
  return person;
};

/**
 * Cập nhật Person
 */
export const update = async (id: string, data: UpdatePersonInput) => {
  // Nếu đổi tên → kiểm tra trùng
  if (data.name) {
    const existing = await Person.findOne({
      name: data.name,
      _id: { $ne: id },
    });
    if (existing) {
      throw new Error(`Tên "${data.name}" đã được sử dụng`);
    }
  }

  const updated = await Person.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).lean();

  if (!updated) throw new Error('Không tìm thấy người này');
  return updated;
};

/**
 * Xóa Person (soft delete — đặt isActive = false)
 * Không xóa cứng vì phim cũ vẫn cần reference
 */
export const remove = async (id: string) => {
  const person = await Person.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true },
  );
  if (!person) throw new Error('Không tìm thấy người này');
  return person;
};
