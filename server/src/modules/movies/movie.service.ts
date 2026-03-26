/**
 * Movies Service — Business logic
 *
 * Dùng: Mongoose models từ models/
 * Tách business logic ra khỏi controller
 * Export các function: create, getAll, getById, getBySlug, update, remove, getRelated
 * Xử lý: pagination (utils/pagination), error throwing
 */

import { Movie } from '../../models/Movie.model.js';
import { Person } from '../../models/Person.model.js';
import { Genre } from '../../models/Genre.model.js';
import { Showtime } from '../../models/Showtime.model.js';
import { getSkip, getPaginationData } from '../../utils/pagination.js';
import { slugify } from '../../utils/slugify.js';
import type {
  CreateMovieInput,
  UpdateMovieInput,
  MovieFilter,
} from '@shared/schemas/movie.schema';

// Populate fields dùng chung
const POPULATE_FIELDS = [
  { path: 'directors', select: 'name slug avatar nationality' },
  { path: 'actors', select: 'name slug avatar nationality' },
  { path: 'genres', select: 'name slug' },
];

/**
 * Tạo phim mới
 * UC-18: Nhập thông tin phim, upload poster, trailer
 */
export const create = async (data: CreateMovieInput) => {
  const slug = slugify(data.title);

  // Kiểm tra slug trùng → thêm timestamp nếu trùng
  const existingSlug = await Movie.findOne({ slug });
  const finalSlug = existingSlug ? `${slug}-${Date.now()}` : slug;

  // Validate directors tồn tại và có role DIRECTOR
  const directors = await Person.find({
    _id: { $in: data.directors },
    roles: 'DIRECTOR',
    isActive: true,
  });
  if (directors.length !== data.directors.length) {
    throw new Error('Một hoặc nhiều đạo diễn không hợp lệ');
  }

  // Validate actors tồn tại và có role ACTOR (nếu có)
  if (data.actors.length > 0) {
    const actors = await Person.find({
      _id: { $in: data.actors },
      roles: 'ACTOR',
      isActive: true,
    });
    if (actors.length !== data.actors.length) {
      throw new Error('Một hoặc nhiều diễn viên không hợp lệ');
    }
  }

  // Validate genres tồn tại
  const genres = await Genre.find({
    _id: { $in: data.genres },
    isActive: true,
  });
  if (genres.length !== data.genres.length) {
    throw new Error('Một hoặc nhiều thể loại không hợp lệ');
  }

  const movie = await Movie.create({
    ...data,
    slug: finalSlug,
    releaseDate: new Date(data.releaseDate),
    endDate: data.endDate ? new Date(data.endDate) : undefined,
  });

  return movie.populate(POPULATE_FIELDS);
};

/**
 * Lấy danh sách phim có phân trang + lọc + tìm kiếm
 * UC-02: Lọc theo thể loại, trạng thái
 * UC-05: Tìm theo tên phim, thể loại, đạo diễn
 */
export const getAll = async (filter: MovieFilter) => {
  const {
    page,
    limit,
    search,
    genre,
    director,
    actor,
    status,
    ageRating,
    audioType,
    country,
    year,
    sortBy,
    sortOrder,
  } = filter;

  const query: any = {};

  // Full-text search theo title
  if (search) {
    query.$text = { $search: search };
  }

  // Lọc theo thể loại (genreId)
  if (genre) {
    query.genres = genre;
  }

  // Lọc theo đạo diễn (personId)
  if (director) {
    query.directors = director;
  }

  // Lọc theo diễn viên (personId)
  if (actor) {
    query.actors = actor;
  }

  // Lọc theo trạng thái
  if (status) {
    query.status = status;
  }

  // Lọc theo giới hạn tuổi
  if (ageRating) {
    query.ageRating = ageRating;
  }

  // Lọc theo kiểu âm thanh
  if (audioType) {
    query.audioType = audioType;
  }

  // Lọc theo quốc gia
  if (country) {
    query.country = country;
  }

  // Lọc theo năm phát hành
  if (year) {
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year + 1, 0, 1);
    query.releaseDate = { $gte: startOfYear, $lt: endOfYear };
  }

  const totalItems = await Movie.countDocuments(query);
  const skip = getSkip(page, limit);

  // Sắp xếp
  const sort: any = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const data = await Movie.find(query)
    .populate(POPULATE_FIELDS)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();

  const pagination = getPaginationData(totalItems, page, limit);

  return { data, pagination };
};

/**
 * Lấy chi tiết phim theo ID + tăng viewCount
 * UC-03: Xem poster, trailer, mô tả, đạo diễn, diễn viên, đánh giá
 */
export const getById = async (id: string) => {
  const movie = await Movie.findById(id).populate(POPULATE_FIELDS).lean();

  if (!movie) throw new Error('Không tìm thấy phim');

  // Tăng viewCount bất đồng bộ (không block response)
  Movie.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }).exec();

  return movie;
};

/**
 * Lấy chi tiết phim theo slug (cho URL SEO-friendly)
 */
export const getBySlug = async (slug: string) => {
  const movie = await Movie.findOne({ slug }).populate(POPULATE_FIELDS).lean();

  if (!movie) throw new Error('Không tìm thấy phim');

  // Tăng viewCount
  Movie.findByIdAndUpdate(movie._id, { $inc: { viewCount: 1 } }).exec();

  return movie;
};

/**
 * Cập nhật phim
 * UC-19: Cập nhật thông tin, đổi poster, thay đổi trạng thái
 */
export const update = async (id: string, data: UpdateMovieInput) => {
  const movie = await Movie.findById(id);
  if (!movie) throw new Error('Không tìm thấy phim');

  const updateData: any = { ...data };

  // Nếu đổi title → tạo slug mới
  if (data.title && data.title !== movie.title) {
    const newSlug = slugify(data.title);
    const existingSlug = await Movie.findOne({
      slug: newSlug,
      _id: { $ne: id },
    });
    updateData.slug = existingSlug ? `${newSlug}-${Date.now()}` : newSlug;
  }

  // Convert date strings thành Date objects
  if (data.releaseDate) {
    updateData.releaseDate = new Date(data.releaseDate);
  }
  if (data.endDate) {
    updateData.endDate = new Date(data.endDate);
  }

  // Validate directors nếu có thay đổi
  if (data.directors) {
    const directors = await Person.find({
      _id: { $in: data.directors },
      roles: 'DIRECTOR',
      isActive: true,
    });
    if (directors.length !== data.directors.length) {
      throw new Error('Một hoặc nhiều đạo diễn không hợp lệ');
    }
  }

  // Validate actors nếu có thay đổi
  if (data.actors && data.actors.length > 0) {
    const actors = await Person.find({
      _id: { $in: data.actors },
      roles: 'ACTOR',
      isActive: true,
    });
    if (actors.length !== data.actors.length) {
      throw new Error('Một hoặc nhiều diễn viên không hợp lệ');
    }
  }

  // Validate genres nếu có thay đổi
  if (data.genres) {
    const genres = await Genre.find({
      _id: { $in: data.genres },
      isActive: true,
    });
    if (genres.length !== data.genres.length) {
      throw new Error('Một hoặc nhiều thể loại không hợp lệ');
    }
  }

  const updated = await Movie.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate(POPULATE_FIELDS);

  if (!updated) throw new Error('Cập nhật phim thất bại');
  return updated;
};

/**
 * Xóa phim
 * UC-20: Xóa phim (chỉ khi chưa có suất chiếu)
 */
export const remove = async (id: string) => {
  const movie = await Movie.findById(id);
  if (!movie) throw new Error('Không tìm thấy phim');

  // Kiểm tra có suất chiếu nào chưa → không cho xóa
  const showtimeCount = await Showtime.countDocuments({ movieId: id });
  if (showtimeCount > 0) {
    throw new Error(
      `Không thể xóa phim vì đã có ${showtimeCount} suất chiếu. Hãy đổi trạng thái sang ENDED.`,
    );
  }

  await Movie.findByIdAndDelete(id);
  return movie;
};

/**
 * Lấy phim liên quan (cùng thể loại)
 * UC-03b: Gợi ý phim cùng thể loại
 */
export const getRelated = async (movieId: string, limitCount = 6) => {
  const movie = await Movie.findById(movieId).select('genres').lean();
  if (!movie) throw new Error('Không tìm thấy phim');

  const related = await Movie.find({
    _id: { $ne: movieId },
    genres: { $in: movie.genres },
    status: { $ne: 'ENDED' },
  })
    .populate(POPULATE_FIELDS)
    .sort({ rating: -1, viewCount: -1 })
    .limit(limitCount)
    .lean();

  return related;
};

/**
 * Lấy phim sắp chiếu
 * UC-03c: Trang "Coming Soon"
 */
export const getUpcoming = async (limitCount = 10) => {
  const data = await Movie.find({ status: 'UPCOMING' })
    .populate(POPULATE_FIELDS)
    .sort({ releaseDate: 1 })
    .limit(limitCount)
    .lean();

  return data;
};

/**
 * Lấy phim đang chiếu
 * UC-01: Trang chủ — phim đang chiếu
 */
export const getNowShowing = async (limitCount = 10) => {
  const data = await Movie.find({ status: 'RELEASED' })
    .populate(POPULATE_FIELDS)
    .sort({ releaseDate: -1 })
    .limit(limitCount)
    .lean();

  return data;
};

/**
 * Lấy danh sách quốc gia (cho dropdown filter)
 */
export const getCountries = async () => {
  const countries = await Movie.distinct('country');
  return countries.filter(Boolean).sort();
};

/**
 * Lấy danh sách năm phát hành (cho dropdown filter)
 */
export const getYears = async () => {
  const movies = await Movie.find({}, { releaseDate: 1 }).lean();
  const years = [
    ...new Set(movies.map((m) => new Date(m.releaseDate).getFullYear())),
  ];
  return years.sort((a, b) => b - a); // Mới nhất trước
};
