/**
 * Cron Job — Cập nhật trạng thái tự động
 *
 * Dùng: node-cron, schedule: '0 0 * * *' (mỗi ngày 0h)
 *
 * Logic:
 * 1. Phim: UPCOMING → RELEASED (nếu releaseDate <= today)
 * 2. Phim: RELEASED → ENDED (nếu endDate < today)
 * 3. Showtime: OPEN → ENDED (nếu startTime < now)
 */

import cron from 'node-cron';
import { Movie } from '../models/Movie.model.js';
import { Showtime } from '../models/Showtime.model.js';
import { MOVIE_STATUS, SHOWTIME_STATUS } from '@shared/constants/statuses.js';

/**
 * Cập nhật trạng thái phim
 */
async function updateMovieStatuses() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // UPCOMING → RELEASED: releaseDate đã qua
  const upcomingToReleased = await Movie.updateMany(
    {
      status: MOVIE_STATUS.UPCOMING,
      releaseDate: { $lte: today },
    },
    { $set: { status: MOVIE_STATUS.RELEASED } }
  );

  // RELEASED → ENDED: endDate đã qua
  const releasedToEnded = await Movie.updateMany(
    {
      status: MOVIE_STATUS.RELEASED,
      endDate: { $lt: today, $exists: true },
    },
    { $set: { status: MOVIE_STATUS.ENDED } }
  );

  console.log(
    `[updateMovieStatuses] UPCOMING→RELEASED: ${upcomingToReleased.modifiedCount}, RELEASED→ENDED: ${releasedToEnded.modifiedCount}`
  );
}

/**
 * Cập nhật trạng thái suất chiếu
 */
async function updateShowtimeStatuses() {
  const now = new Date();

  // OPEN → ENDED: startTime đã qua
  const result = await Showtime.updateMany(
    {
      status: SHOWTIME_STATUS.OPEN,
      startTime: { $lt: now },
    },
    { $set: { status: SHOWTIME_STATUS.ENDED } }
  );

  console.log(`[updateShowtimeStatuses] OPEN→ENDED: ${result.modifiedCount}`);
}

/**
 * Job chính - chạy tất cả cập nhật
 */
export async function runStatusUpdates() {
  console.log('[Cron] Running status updates...');
  try {
    await updateMovieStatuses();
    await updateShowtimeStatuses();
    console.log('[Cron] Status updates completed');
  } catch (error) {
    console.error('[Cron] Status update error:', error);
  }
}

/**
 * Khởi tạo cron job - chạy mỗi ngày lúc 0h
 */
export function initStatusUpdateJob() {
  // Chạy mỗi ngày lúc 00:00
  cron.schedule('0 0 * * *', runStatusUpdates);
  console.log('[Cron] Status update job scheduled (daily at 00:00)');

  // Chạy ngay khi khởi động server
  runStatusUpdates();
}
