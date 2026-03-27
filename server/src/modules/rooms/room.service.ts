import mongoose from 'mongoose';
import { CinemaRoom } from '../../models/CinemaRoom.model.js';
import { Cinema } from '../../models/Cinema.model.js';
import { Showtime } from '../../models/Showtime.model.js';
import { getSkip, getPaginationData } from '../../utils/pagination.js';
import { SEAT_TYPE } from '@shared/constants/seat-types.js';
import { SHOWTIME_STATUS } from '@shared/constants/statuses.js';
import type {
  CreateRoomInput,
  PatchRoomInput,
  RoomFilter,
  SeatConfig,
} from '@shared/schemas/room.schema.js';

const httpError = (message: string, statusCode: number) => {
  const e = new Error(message) as Error & { statusCode: number };
  e.statusCode = statusCode;
  return e;
};

const ROW_LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const buildDefaultSeats = (rows: number, cols: number): SeatConfig[] => {
  const seats: SeatConfig[] = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 1; j <= cols; j++) {
      const row = ROW_LABELS[i];
      seats.push({
        seatId: `${row}${j}`,
        row,
        col: j,
        type: SEAT_TYPE.NORMAL,
        isActive: true,
      });
    }
  }
  return seats;
};

function assertSeatsMatchGrid(rows: number, cols: number, seats: SeatConfig[]) {
  if (seats.length !== rows * cols) {
    throw httpError('Số ghế phải bằng số hàng × số cột', 400);
  }
  const seen = new Set<string>();
  for (const s of seats) {
    const key = `${s.row}-${s.col}`;
    if (seen.has(key)) throw httpError('Trùng vị trí ghế trong dữ liệu', 400);
    seen.add(key);
  }
}

function sameSeatTopology(prev: SeatConfig[], next: SeatConfig[]) {
  if (prev.length !== next.length) return false;
  const ids = new Set(prev.map((s) => s.seatId));
  for (const s of next) {
    if (!ids.has(s.seatId)) return false;
  }
  return true;
}

async function hasUpcomingOpenShowtimes(roomId: mongoose.Types.ObjectId) {
  const now = new Date();
  const n = await Showtime.countDocuments({
    roomId,
    status: SHOWTIME_STATUS.OPEN,
    startTime: { $gte: now },
  });
  return n > 0;
}

/**
 * UC-27: Thêm phòng chiếu (Admin) — gắn chi nhánh, loại phòng, lưới ghế mặc định
 */
export const create = async (data: CreateRoomInput) => {
  if (!mongoose.Types.ObjectId.isValid(data.cinemaId)) {
    throw httpError('ID chi nhánh không hợp lệ', 400);
  }

  const cinema = await Cinema.findById(data.cinemaId);
  if (!cinema || !cinema.isActive) {
    throw httpError('Chi nhánh không tồn tại hoặc đã ngừng hoạt động', 400);
  }

  const nameTrim = data.name.trim();
  const dup = await CinemaRoom.findOne({
    cinemaId: data.cinemaId,
    name: nameTrim,
  });
  if (dup) {
    throw httpError('Tên phòng đã tồn tại tại chi nhánh này', 409);
  }

  let seats: SeatConfig[];
  if (data.seats && data.seats.length > 0) {
    assertSeatsMatchGrid(data.rows, data.cols, data.seats);
    seats = data.seats;
  } else {
    seats = buildDefaultSeats(data.rows, data.cols);
  }

  const room = await CinemaRoom.create({
    cinemaId: data.cinemaId,
    name: nameTrim,
    roomType: data.roomType,
    rows: data.rows,
    cols: data.cols,
    seats,
    isActive: true,
  });

  await room.populate('cinemaId', 'name city');
  return room;
};

export const getById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw httpError('ID không hợp lệ', 400);
  }
  const room = await CinemaRoom.findById(id).populate('cinemaId', 'name city');
  if (!room) throw httpError('Không tìm thấy phòng chiếu', 404);
  return room;
};

export const getAll = async (filter: RoomFilter) => {
  const { page, limit, cinemaId } = filter;
  const query: Record<string, unknown> = {};
  if (cinemaId) query.cinemaId = cinemaId;

  const totalItems = await CinemaRoom.countDocuments(query);
  const skip = getSkip(page, limit);
  const data = await CinemaRoom.find(query)
    .select('-seats')
    .populate('cinemaId', 'name city')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const pagination = getPaginationData(totalItems, page, limit);
  return { data, pagination };
};

/**
 * UC-28: Cấu hình ghế — UC-29: Sửa phòng / bật tắt hoạt động
 */
export const update = async (id: string, data: PatchRoomInput) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw httpError('ID không hợp lệ', 400);
  }
  const room = await CinemaRoom.findById(id);
  if (!room) throw httpError('Không tìm thấy phòng chiếu', 404);

  const upcoming = await hasUpcomingOpenShowtimes(room._id);

  if (data.isActive === false && upcoming) {
    throw httpError(
      'Không thể vô hiệu hóa phòng khi còn suất chiếu đang mở trong tương lai',
      409,
    );
  }

  const nextRows = data.rows !== undefined ? data.rows : room.rows;
  const nextCols = data.cols !== undefined ? data.cols : room.cols;
  const gridSizeChanged =
    nextRows !== room.rows || nextCols !== room.cols;

  let nextSeats: SeatConfig[] = (room.seats as SeatConfig[]).map((s) => ({
    ...s,
  }));

  if (data.seats !== undefined) {
    assertSeatsMatchGrid(nextRows, nextCols, data.seats);
    if (upcoming) {
      if (gridSizeChanged) {
        throw httpError(
          'Không đổi kích thước lưới ghế khi còn suất chiếu sắp tới',
          409,
        );
      }
      if (!sameSeatTopology(room.seats as SeatConfig[], data.seats)) {
        throw httpError(
          'Khi còn suất chiếu sắp tới chỉ được đổi loại ghế hoặc bật/tắt ghế (giữ nguyên mã ghế)',
          409,
        );
      }
    }
    nextSeats = data.seats;
  } else if (
    (data.rows !== undefined || data.cols !== undefined) &&
    gridSizeChanged
  ) {
    if (upcoming) {
      throw httpError(
        'Không đổi số hàng/cột khi còn suất chiếu sắp tới',
        409,
      );
    }
    nextSeats = buildDefaultSeats(nextRows, nextCols);
  }

  if (data.name !== undefined) {
    const nameTrim = data.name.trim();
    const dup = await CinemaRoom.findOne({
      cinemaId: room.cinemaId,
      name: nameTrim,
      _id: { $ne: room._id },
    });
    if (dup) throw httpError('Tên phòng đã tồn tại tại chi nhánh này', 409);
    room.name = nameTrim;
  }
  if (data.roomType !== undefined) room.roomType = data.roomType;
  if (data.rows !== undefined) room.rows = nextRows;
  if (data.cols !== undefined) room.cols = nextCols;
  if (data.isActive !== undefined) room.isActive = data.isActive;

  room.seats = nextSeats as typeof room.seats;
  await room.save();
  await room.populate('cinemaId', 'name city');
  return room;
};

/** UC-29: Vô hiệu hóa phòng (soft) */
export const deactivate = async (id: string) => update(id, { isActive: false });
