import { Person } from '../../models/Person.model.js';
import { getSkip, getPaginationData } from '../../utils/pagination.js';
import { slugify } from '../../utils/slugify.js';
import type {
  CreatePersonInput,
  UpdatePersonInput,
  PersonFilter,
} from '@shared/schemas/person.schema';

/**
 * Tạo mới Person
 */
export const create = async (data: CreatePersonInput) => {
  // Kiểm tra trùng bộ (Tên + Ngày sinh) thay vì chỉ mỗi tên
  if (data.name && data.birthDate) {
    const existing = await Person.findOne({
      name: data.name,
      birthDate: data.birthDate,
      isActive: true,
    });
    if (existing) {
      throw new Error(`Người này (${data.name}) với ngày sinh đã chọn đã tồn tại.`);
    }
  }

  const baseSlug = slugify(data.name);
  let slug = baseSlug;
  let counter = 1;
  while (await Person.exists({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const person = await Person.create({ ...data, slug });
  return person;
};

/**
 * Lấy danh sách Person - Dùng Text Index để tìm kiếm
 */
export const getAll = async (filter: PersonFilter) => {
  const { page, limit, search, role, nationality, sortBy, sortOrder } = filter;

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

  const sortParam = sortBy || 'viewCount';
  const orderParam = sortOrder === 'asc' ? 1 : -1;

  const data = await Person.find(query)
    .sort(search ? { score: { $meta: 'textScore' } } : { [sortParam]: orderParam }) 
    .skip(skip)
    .limit(limit)
    .lean();

  const pagination = getPaginationData(totalItems, page, limit);

  return { data, pagination };
};

/**
 * Lấy chi tiết Person bằng ID
 */
export const getById = async (id: string) => {
  const person = await Person.findById(id).lean();
  if (!person) throw new Error('Không tìm thấy người này');
  return person;
};

/**
 * Lấy chi tiết Person bằng slug
 */
export const getBySlug = async (slug: string) => {
  const person = await Person.findOneAndUpdate(
    { slug, isActive: true },
    { $inc: { viewCount: 1 } },
    { new: true }
  ).lean();
  if (!person) throw new Error('Không tìm thấy người này');
  return person;
};

/**
 * Lấy danh sách Quốc Tịch dựa trên Roles (ACTOR/DIRECTOR)
 */
export const getNationalities = async (role?: string) => {
  const query: any = { isActive: true, nationality: { $exists: true, $ne: '' } };
  if (role) query.roles = role;
  
  const results = await Person.distinct('nationality', query);
  return results.filter(Boolean).sort();
};

/**
 * Cập nhật Person
 */
export const update = async (id: string, data: UpdatePersonInput) => {
  if (data.name || data.birthDate) {
    const current = await Person.findById(id);
    if (!current) throw new Error('Không tìm thấy người này');

    const nameToCheck = data.name || current.name;
    const birthToCheck = data.birthDate || current.birthDate;

    if (birthToCheck) {
      const duplicate = await Person.findOne({
        name: nameToCheck,
        birthDate: birthToCheck,
        _id: { $ne: id },
        isActive: true,
      });
      if (duplicate) throw new Error('Thông tin này trùng với một người khác đã có.');
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
 * Xóa Person (soft delete)
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
