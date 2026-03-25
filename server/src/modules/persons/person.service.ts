import { Person } from '../../models/Person.model.js';
import { getSkip, getPaginationData } from '../../utils/pagination.js';
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

  const person = await Person.create(data);
  return person;
};

/**
 * Lấy danh sách Person - Dùng Text Index để tìm kiếm
 */
export const getAll = async (filter: PersonFilter) => {
  const { page, limit, search, role, nationality } = filter;

  const query: any = { isActive: true };

  if (search) {
    // Quay lại dùng $text index
    // Lưu ý: Model Person phải được đánh index: personSchema.index({ name: 'text' })
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

  // Nếu dùng $text, thường người ta sẽ sort theo độ liên quan (score) 
  // nhưng ở đây bạn đang muốn sort theo tên (A-Z) nên mình giữ nguyên sort name
  const data = await Person.find(query)
    .sort(search ? { score: { $meta: 'textScore' } } : { name: 1 }) 
    .skip(skip)
    .limit(limit)
    .lean();

  const pagination = getPaginationData(totalItems, page, limit);

  return { data, pagination };
};

/**
 * Lấy chi tiết Person
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