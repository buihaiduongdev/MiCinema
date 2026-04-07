/**
 * Statistics Service — Business logic
 *
 * Dùng: Mongoose models từ models/
 * Tách business logic ra khỏi controller
 * Export các function: create, getAll, getById, update, delete
 * Xử lý: pagination (utils/pagination), error throwing
 */

import { Booking } from '../../models/Booking.model.js';
import { User } from '../../models/User.model.js';
import { Showtime } from '../../models/Showtime.model.js';
import { CinemaRoom } from '../../models/CinemaRoom.model.js';
import { Movie } from '../../models/Movie.model.js';
import { BOOKING_STATUS } from '@shared/constants/statuses.js';

const REVENUE_BOOKING_STATUSES = [
  BOOKING_STATUS.PAID,
  BOOKING_STATUS.COMPLETED,
];

type RevenueOptions = {
  startDate?: Date;
  endDate?: Date;
  groupBy?: 'day' | 'week' | 'month';
};

type OccupancyOptions = {
  showtimeId?: string;
  roomId?: string;
};

type BookingStatsOptions = {
  startDate?: Date;
  endDate?: Date;
};

type UserGrowthOptions = {
  startDate?: Date;
  endDate?: Date;
  groupBy?: 'day' | 'week' | 'month';
};

/**
 * Get dashboard overview — tổng quan các chỉ số chính
 */
export const getOverview = async () => {
  const [
    totalRevenue,
    totalBookings,
    totalUsers,
    completedBookings,
    cancelledBookings,
    totalMovies,
    totalShowtimes,
  ] = await Promise.all([
    Booking.aggregate([
      { $match: { status: { $in: REVENUE_BOOKING_STATUSES } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]),
    Booking.countDocuments(),
    User.countDocuments(),
    Booking.countDocuments({ status: BOOKING_STATUS.COMPLETED }),
    Booking.countDocuments({ status: BOOKING_STATUS.CANCELLED }),
    Movie.countDocuments(),
    Showtime.countDocuments(),
  ]);

  const successRate =
    totalBookings > 0
      ? ((completedBookings / totalBookings) * 100).toFixed(2)
      : 0;

  return {
    totalRevenue: totalRevenue[0]?.total || 0,
    totalBookings,
    totalUsers,
    completedBookings,
    cancelledBookings,
    successRate: parseFloat(successRate as string),
    totalMovies,
    totalShowtimes,
  };
};

/**
 * Get revenue statistics grouped by date/week/month
 */
export const getRevenue = async (opts: RevenueOptions = {}) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = opts;

    const match: any = { status: { $in: REVENUE_BOOKING_STATUSES } };
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = startDate;
      if (endDate) match.createdAt.$lte = endDate;
    }

    // Determine grouping format
    let dateFormat = '%Y-%m-%d'; // day
    if (groupBy === 'week') dateFormat = '%Y-%m-%d'; // Use day format, will aggregate by week
    if (groupBy === 'month') dateFormat = '%Y-%m';

    const pipeline: any[] = [
      { $match: match },
      { $match: { createdAt: { $exists: true } } },
      {
        $addFields: {
          createdAtDate: { $toDate: '$createdAt' },
        },
      },
    ];

    if (groupBy === 'week') {
      pipeline.push({
        $group: {
          _id: {
            year: { $isoWeekYear: '$createdAtDate' },
            week: { $isoWeek: '$createdAtDate' },
          },
          revenue: { $sum: '$totalPrice' },
          bookings: { $sum: 1 },
        },
      });
      pipeline.push({
        $project: {
          _id: {
            $concat: [
              { $toString: '$_id.year' },
              '-W',
              {
                $cond: [
                  { $lt: ['$_id.week', 10] },
                  { $concat: ['0', { $toString: '$_id.week' }] },
                  { $toString: '$_id.week' },
                ],
              },
            ],
          },
          revenue: 1,
          bookings: 1,
        },
      });
      pipeline.push({ $sort: { _id: 1 } });
    } else if (groupBy === 'month') {
      pipeline.push({
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m', date: '$createdAtDate' },
          },
          revenue: { $sum: '$totalPrice' },
          bookings: { $sum: 1 },
        },
      });
      pipeline.push({ $sort: { _id: 1 } });
    } else {
      pipeline.push({
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAtDate' },
          },
          revenue: { $sum: '$totalPrice' },
          bookings: { $sum: 1 },
        },
      });
      pipeline.push({ $sort: { _id: 1 } });
    }
    const data = await Booking.aggregate(pipeline);

    // Calculate summary statistics
    const summary = await Booking.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
          totalBookings: { $sum: 1 },
          averageRevenuePerBooking: { $avg: '$totalPrice' },
        },
      },
    ]);

    return {
      groupBy,
      data,
      summary: summary[0] || {
        totalRevenue: 0,
        totalBookings: 0,
        averageRevenuePerBooking: 0,
      },
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get occupancy rate statistics
 */
export const getOccupancy = async (opts: OccupancyOptions = {}) => {
  const { showtimeId, roomId } = opts;

  const match: any = {};
  if (showtimeId) match.showtimeId = showtimeId;
  if (roomId) match.roomId = roomId;

  // Get all showtimes (for total seats)
  const showtimes = await Showtime.find(match).populate('roomId');

  const occupancyData = await Promise.all(
    showtimes.map(async (showtime: any) => {
      // Calculate total seats from room layout (rows * cols)
      const room = showtime.roomId as any;
      const totalSeats = (room.rows || 0) * (room.cols || 0);

      const bookedSeats = await Booking.countDocuments({
        showtimeId: showtime._id,
        status: { $ne: BOOKING_STATUS.CANCELLED },
      });

      const occupancyRate =
        totalSeats > 0 ? ((bookedSeats / totalSeats) * 100).toFixed(2) : 0;

      return {
        showtimeId: showtime._id,
        movieId: showtime.movieId,
        roomId: showtime.roomId._id,
        roomName: (showtime.roomId as any).name,
        startTime: showtime.startTime,
        totalSeats,
        bookedSeats,
        availableSeats: totalSeats - bookedSeats,
        occupancyRate: parseFloat(occupancyRate as string),
      };
    }),
  );

  return occupancyData;
};

/**
 * Get occupancy rate by room (aggregate)
 */
export const getOccupancyByRoom = async () => {
  const rooms = await CinemaRoom.find({ isActive: true });

  const roomOccupancy = await Promise.all(
    rooms.map(async (room: any) => {
      const totalSeats = (room.rows || 0) * (room.cols || 0);

      // Get all showtimes for this room
      const showtimes = await Showtime.find({ roomId: room._id });
      const showtimeIds = showtimes.map((s) => s._id);

      const bookedSeats = await Booking.countDocuments({
        showtimeId: { $in: showtimeIds },
        status: { $ne: BOOKING_STATUS.CANCELLED },
      });

      const occupancyRate =
        totalSeats > 0 ? ((bookedSeats / totalSeats) * 100).toFixed(2) : 0;

      return {
        roomId: room._id,
        roomName: room.name,
        roomType: room.roomType,
        rows: room.rows,
        cols: room.cols,
        totalSeats,
        bookedSeats,
        availableSeats: totalSeats - bookedSeats,
        occupancyRate: parseFloat(occupancyRate as string),
      };
    }),
  );

  // Calculate overall occupancy
  const totalSeats = roomOccupancy.reduce(
    (sum, room) => sum + room.totalSeats,
    0,
  );
  const totalBooked = roomOccupancy.reduce(
    (sum, room) => sum + room.bookedSeats,
    0,
  );
  const overallOccupancyRate =
    totalSeats > 0 ? ((totalBooked / totalSeats) * 100).toFixed(2) : 0;

  return {
    overallOccupancyRate: parseFloat(overallOccupancyRate as string),
    byRoom: roomOccupancy,
  };
};

/**
 * Get booking statistics by status
 */
export const getBookingStats = async (opts: BookingStatsOptions = {}) => {
  const { startDate, endDate } = opts;

  const match: any = {};
  if (startDate || endDate) {
    match.createdAt = {};
    if (startDate) match.createdAt.$gte = startDate;
    if (endDate) match.createdAt.$lte = endDate;
  }

  const stats = await Booking.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalRevenue: {
          $sum: {
            $cond: [
              { $eq: ['$status', BOOKING_STATUS.PAID] },
              '$totalPrice',
              0,
            ],
          },
        },
      },
    },
  ]);

  return {
    startDate,
    endDate,
    data: stats,
  };
};

/**
 * Get movie performance statistics
 */
export const getMoviePerformance = async (limit = 10) => {
  const movieStats = await Movie.aggregate([
    {
      $lookup: {
        from: 'showtimes',
        localField: '_id',
        foreignField: 'movieId',
        as: 'showtimes',
      },
    },
    {
      $addFields: {
        showtimeIds: '$showtimes._id',
        showtimeIdStrings: {
          $map: {
            input: '$showtimes',
            as: 'showtime',
            in: { $toString: '$$showtime._id' },
          },
        },
      },
    },
    {
      $lookup: {
        from: 'bookings',
        let: {
          showtimeIds: '$showtimeIds',
          showtimeIdStrings: '$showtimeIdStrings',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$status', BOOKING_STATUS.PAID] },
                  {
                    $or: [
                      { $in: ['$showtimeId', '$$showtimeIds'] },
                      {
                        $in: [
                          { $toString: '$showtimeId' },
                          '$$showtimeIdStrings',
                        ],
                      },
                    ],
                  },
                ],
              },
            },
          },
        ],
        as: 'bookings',
      },
    },
    {
      $addFields: {
        totalBookings: { $size: '$bookings' },
        totalRevenue: {
          $ifNull: [{ $sum: '$bookings.totalPrice' }, 0],
        },
        averageTicketPrice: {
          $ifNull: [{ $avg: '$bookings.totalPrice' }, 0],
        },
        totalTicketsSold: {
          $ifNull: [
            {
              $sum: {
                $map: {
                  input: '$bookings',
                  as: 'booking',
                  in: {
                    $cond: [
                      { $isArray: '$$booking.seats' },
                      { $size: '$$booking.seats' },
                      1,
                    ],
                  },
                },
              },
            },
            0,
          ],
        },
      },
    },
    {
      $project: {
        movieId: '$_id',
        movieTitle: '$title',
        moviePoster: '$poster',
        viewCount: 1,
        totalBookings: 1,
        totalRevenue: 1,
        averageTicketPrice: 1,
        totalTicketsSold: 1,
      },
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: limit },
  ]);

  return movieStats.map((stat, index) => ({
    rank: index + 1,
    ...stat,
  }));
};

/**
 * Get top movies by revenue
 */
export const getTopMoviesByRevenue = async (limit = 10) => {
  return getMoviePerformance(limit);
};

/**
 * Get movies with detailed statistics
 */
export const getMovieDetailedStats = async (limit = 10) => {
  const movieStats = await Booking.aggregate([
    { $match: { status: { $ne: BOOKING_STATUS.CANCELLED } } },
    {
      $lookup: {
        from: 'showtimes',
        localField: 'showtimeId',
        foreignField: '_id',
        as: 'showtime',
      },
    },
    { $unwind: '$showtime' },
    {
      $lookup: {
        from: 'movies',
        localField: 'showtime.movieId',
        foreignField: '_id',
        as: 'movie',
      },
    },
    { $unwind: '$movie' },
    {
      $group: {
        _id: '$movie._id',
        movieId: { $first: '$movie._id' },
        movieTitle: { $first: '$movie.title' },
        moviePoster: { $first: '$movie.poster' },
        status: { $first: '$movie.status' },
        totalBookings: { $sum: 1 },
        totalRevenue: { $sum: '$totalPrice' },
        averageTicketPrice: { $avg: '$totalPrice' },
        totalTicketsSold: {
          $sum: { $size: '$seats' },
        },
        showtimesCount: { $sum: 1 },
      },
    },
    {
      $facet: {
        byRevenue: [{ $sort: { totalRevenue: -1 } }, { $limit: limit }],
        byBookings: [{ $sort: { totalBookings: -1 } }, { $limit: limit }],
      },
    },
  ]);

  return {
    topByRevenue: movieStats[0]?.byRevenue || [],
    topByBookings: movieStats[0]?.byBookings || [],
  };
};

/**
 * Get user growth statistics
 */
export const getUserGrowth = async (opts: UserGrowthOptions = {}) => {
  const { startDate, endDate, groupBy = 'day' } = opts;

  const match: any = {};
  if (startDate || endDate) {
    match.createdAt = {};
    if (startDate) match.createdAt.$gte = startDate;
    if (endDate) match.createdAt.$lte = endDate;
  }

  // Determine grouping format
  let dateFormat = '%Y-%m-%d'; // day
  if (groupBy === 'week') dateFormat = '%Y-W%V';
  if (groupBy === 'month') dateFormat = '%Y-%m';

  const data = await User.aggregate([
    { $match: match },
    {
      $group: {
        _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
        newUsers: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return {
    groupBy,
    data,
  };
};
