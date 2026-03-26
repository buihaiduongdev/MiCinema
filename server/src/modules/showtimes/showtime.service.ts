/**
 * Showtimes Service — Business logic
 *
 * Dùng: Mongoose models từ models/
 * Tách business logic ra khỏi controller
 * Export các function: create, getAll, getById, update, cancel, getByMovie, getByCinema
 * Xử lý: pagination (utils/pagination), error throwing, conflict detection
 */

import { Showtime } from '../../models/Showtime.model.js';
import { Movie } from '../../models/Movie.model.js';
import { Cinema } from '../../models/Cinema.model.js';
import { CinemaRoom } from '../../models/CinemaRoom.model.js';
import { Booking } from '../../models/Booking.model.js';
import { getSkip, getPaginationData } from '../../utils/pagination.js';
import { SHOWTIME_STATUS } from '@shared/constants/statuses.js';
import { BOOKING_STATUS } from '@shared/constants/statuses.js';
import type {
  CreateShowtimeInput,
  UpdateShowtimeInput,
  ShowtimeFilter,
} from '@shared/schemas/showtime.schema';

// Populate fields dùng chung
const POPULATE_FIELDS = [
  { path: 'movieId', select: 'title slug poster duration ageRating audioType' },
  { path: 'cinemaId', select: 'name slug city address' },
  { path: 'roomId', select: 'name roomType rows cols' },
];

// Buffer time giữa các suất chiếu (15 phút dọn phòng)
const BUFFER_MINUTES = 15;

/**
 * Tạo suất chiếu mới
 * UC-21: Chọn phim + phòng + giờ chiếu + giá vé
 * Kiểm tra: phim tồn tại, phòng thuộc chi nhánh, không trùng lịch
 */
export const create = async (data: CreateShowtimeInput) => {
  // 1. Validate phim tồn tại và chưa ENDED
  const movie = await Movie.findById(data.movieId);
  if (!movie) throw new Error('Không tìm thấy phim');
  if (movie.status === 'ENDED') {
    throw new Error('Phim đã ngừng chiếu, không thể tạo suất chiếu');
  }

  // 2. Validate chi nhánh tồn tại
  const cinema = await Cinema.findById(data.cinemaId);
  if (!cinema || !cinema.isActive) {
    throw new Error('Chi nhánh rạp không hợp lệ');
  }

  // 3. Validate phòng tồn tại và thuộc chi nhánh đó
  const room = await CinemaRoom.findById(data.roomId);
  if (!room || !room.isActive) {
    throw new Error('Phòng chiếu không hợp lệ');
  }
  if (room.cinemaId.toString() !== data.cinemaId) {
    throw new Error('Phòng chiếu không thuộc chi nhánh này');
  }

  // 4. Kiểm tra trùng lịch (cùng phòng, cùng khoảng thời gian)
  const startTime = new Date(data.startTime);
  const endTime = new Date(
    startTime.getTime() + (movie.duration + BUFFER_MINUTES) * 60 * 1000,
  );

  const conflict = await Showtime.findOne({
    roomId: data.roomId,
    status: { $ne: SHOWTIME_STATUS.CANCELLED },
    $or: [
      {
        // Suất mới bắt đầu trong khoảng suất cũ
        startTime: { $lt: endTime, $gte: startTime },
      },
      {
        // Suất cũ chưa kết thúc khi suất mới bắt đầu
        // Cần lookup duration từ movie → dùng aggregate hoặc check thủ công
        startTime: { $lte: startTime },
      },
    ],
  }).populate({ path: 'movieId', select: 'duration' });

  // Check overlap chính xác (tính cả duration phim cũ)
  if (conflict) {
    const conflictMovie = conflict.movieId as any;
    const conflictEnd = new Date(
      conflict.startTime.getTime() +
        (conflictMovie.duration + BUFFER_MINUTES) * 60 * 1000,
    );
    if (startTime < conflictEnd && endTime > conflict.startTime) {
      throw new Error(
        `Phòng đã có suất chiếu từ ${conflict.startTime.toLocaleString('vi-VN')} ` +
          `đến ${conflictEnd.toLocaleString('vi-VN')}. Vui lòng chọn giờ khác.`,
      );
    }
  }

  // 5. Tạo suất chiếu
  const showtime = await Showtime.create({
    ...data,
    startTime,
  });

  return showtime.populate(POPULATE_FIELDS);
};

/**
 * Lấy danh sách suất chiếu có phân trang + lọc
 * UC-04: Xem lịch chiếu theo ngày, phòng, giờ
 */
export const getAll = async (filter: ShowtimeFilter) => {
  const {
    page,
    limit,
    movieId,
    cinemaId,
    roomId,
    date,
    status,
    fromDate,
    toDate,
    sortBy,
    sortOrder,
  } = filter;

  const query: any = {};

  if (movieId) query.movieId = movieId;
  if (cinemaId) query.cinemaId = cinemaId;
  if (roomId) query.roomId = roomId;
  if (status) query.status = status;

  // Lọc theo ngày cụ thể (YYYY-MM-DD)
  if (date) {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    query.startTime = { $gte: dayStart, $lte: dayEnd };
  }

  // Lọc theo khoảng thời gian
  if (fromDate || toDate) {
    query.startTime = query.startTime || {};
    if (fromDate) query.startTime.$gte = new Date(fromDate);
    if (toDate) query.startTime.$lte = new Date(toDate);
  }

  const totalItems = await Showtime.countDocuments(query);
  const skip = getSkip(page, limit);

  const sort: any = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const data = await Showtime.find(query)
    .populate(POPULATE_FIELDS)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();

  const pagination = getPaginationData(totalItems, page, limit);

  return { data, pagination };
};

/**
 * Lấy chi tiết suất chiếu theo ID
 */
export const getById = async (id: string) => {
  const showtime = await Showtime.findById(id).populate(POPULATE_FIELDS).lean();

  if (!showtime) throw new Error('Không tìm thấy suất chiếu');
  return showtime;
};

/**
 * Lấy suất chiếu theo phim (cho trang chi tiết phim)
 * UC-04: Xem lịch chiếu phim — chỉ lấy suất chiếu OPEN từ hôm nay trở đi
 */
export const getByMovie = async (movieId: string, cinemaId?: string) => {
  const query: any = {
    movieId,
    status: SHOWTIME_STATUS.OPEN,
    startTime: { $gte: new Date() },
  };

  if (cinemaId) query.cinemaId = cinemaId;

  const data = await Showtime.find(query)
    .populate(POPULATE_FIELDS)
    .sort({ startTime: 1 })
    .lean();

  // Nhóm theo ngày → theo chi nhánh → theo phòng
  const grouped = groupShowtimesByDate(data);

  return grouped;
};

/**
 * Lấy suất chiếu theo chi nhánh (cho trang chi nhánh)
 */
export const getByCinema = async (cinemaId: string, date?: string) => {
  const query: any = {
    cinemaId,
    status: SHOWTIME_STATUS.OPEN,
  };

  if (date) {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    query.startTime = { $gte: dayStart, $lte: dayEnd };
  } else {
    query.startTime = { $gte: new Date() };
  }

  const data = await Showtime.find(query)
    .populate(POPULATE_FIELDS)
    .sort({ startTime: 1 })
    .lean();

  return data;
};

/**
 * Cập nhật suất chiếu
 * UC-22: Đổi giờ, giá vé (chỉ khi chưa có ai đặt)
 */
export const update = async (id: string, data: UpdateShowtimeInput) => {
  const showtime = await Showtime.findById(id);
  if (!showtime) throw new Error('Không tìm thấy suất chiếu');

  if (showtime.status === SHOWTIME_STATUS.CANCELLED) {
    throw new Error('Suất chiếu đã bị huỷ, không thể cập nhật');
  }

  if (showtime.status === SHOWTIME_STATUS.FINISHED) {
    throw new Error('Suất chiếu đã kết thúc, không thể cập nhật');
  }

  // Nếu sửa giờ hoặc phòng → kiểm tra đã có booking chưa
  if (data.startTime || data.roomId) {
    const bookingCount = await Booking.countDocuments({
      showtimeId: id,
      status: { $in: [BOOKING_STATUS.PENDING, BOOKING_STATUS.PAID] },
    });
    if (bookingCount > 0) {
      throw new Error(
        `Không thể đổi giờ/phòng vì đã có ${bookingCount} vé được đặt. Chỉ có thể sửa giá vé.`,
      );
    }
  }

  // Nếu đổi giờ → kiểm tra trùng lịch
  if (data.startTime || data.roomId) {
    const movie = await Movie.findById(data.movieId || showtime.movieId);
    if (!movie) throw new Error('Phim không tồn tại');

    const newStartTime = data.startTime
      ? new Date(data.startTime)
      : showtime.startTime;
    const newRoomId = data.roomId || showtime.roomId.toString();
    const endTime = new Date(
      newStartTime.getTime() + (movie.duration + BUFFER_MINUTES) * 60 * 1000,
    );

    const conflict = await Showtime.findOne({
      _id: { $ne: id },
      roomId: newRoomId,
      status: { $ne: SHOWTIME_STATUS.CANCELLED },
      startTime: { $lt: endTime },
    }).populate({ path: 'movieId', select: 'duration' });

    if (conflict) {
      const conflictMovie = conflict.movieId as any;
      const conflictEnd = new Date(
        conflict.startTime.getTime() +
          (conflictMovie.duration + BUFFER_MINUTES) * 60 * 1000,
      );
      if (newStartTime < conflictEnd) {
        throw new Error(
          'Phòng đã có suất chiếu trùng giờ. Vui lòng chọn giờ khác.',
        );
      }
    }
  }

  const updateData: any = { ...data };
  if (data.startTime) updateData.startTime = new Date(data.startTime);

  const updated = await Showtime.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate(POPULATE_FIELDS);

  if (!updated) throw new Error('Cập nhật suất chiếu thất bại');
  return updated;
};

/**
 * Huỷ suất chiếu
 * UC-23: Huỷ suất chiếu + tự động hoàn vé cho KH
 */
export const cancel = async (id: string) => {
  const showtime = await Showtime.findById(id);
  if (!showtime) throw new Error('Không tìm thấy suất chiếu');

  if (showtime.status === SHOWTIME_STATUS.CANCELLED) {
    throw new Error('Suất chiếu đã được huỷ trước đó');
  }

  if (showtime.status === SHOWTIME_STATUS.FINISHED) {
    throw new Error('Suất chiếu đã kết thúc, không thể huỷ');
  }

  // Huỷ tất cả booking liên quan (PENDING + PAID → CANCELLED)
  const affectedBookings = await Booking.updateMany(
    {
      showtimeId: id,
      status: { $in: [BOOKING_STATUS.PENDING, BOOKING_STATUS.PAID] },
    },
    { status: BOOKING_STATUS.CANCELLED },
  );

  // Cập nhật trạng thái suất chiếu
  showtime.status = SHOWTIME_STATUS.CANCELLED;
  await showtime.save();

  return {
    showtime: await showtime.populate(POPULATE_FIELDS),
    cancelledBookings: affectedBookings.modifiedCount,
  };
};

/**
 * Helper: Nhóm suất chiếu theo ngày
 */
const groupShowtimesByDate = (showtimes: any[]) => {
  const grouped: Record<string, any[]> = {};

  for (const showtime of showtimes) {
    // Dùng local date (UTC+7) thay vì UTC để tránh lệch ngày
    const d = new Date(showtime.startTime);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(showtime);
  }

  // Trả về mảng sorted theo ngày
  return Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, showtimes]) => ({
      date,
      showtimes,
    }));
};
