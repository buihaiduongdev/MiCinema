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
import { BOOKING_STATUS } from '@shared/constants/statuses.js';

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
    ] = await Promise.all([
        Booking.aggregate([
            { $match: { status: BOOKING_STATUS.PAID } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } },
        ]),
        Booking.countDocuments(),
        User.countDocuments(),
        Booking.countDocuments({ status: BOOKING_STATUS.COMPLETED }),
        Booking.countDocuments({ status: BOOKING_STATUS.CANCELLED }),
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
    };
};

/**
 * Get revenue statistics grouped by date/week/month
 */
export const getRevenue = async (opts: RevenueOptions = {}) => {
    const { startDate, endDate, groupBy = 'day' } = opts;

    const match: any = { status: BOOKING_STATUS.PAID };
    if (startDate || endDate) {
        match.createdAt = {};
        if (startDate) match.createdAt.$gte = startDate;
        if (endDate) match.createdAt.$lte = endDate;
    }

    // Determine grouping format
    let dateFormat = '%Y-%m-%d'; // day
    if (groupBy === 'week') dateFormat = '%Y-W%V';
    if (groupBy === 'month') dateFormat = '%Y-%m';

    const data = await Booking.aggregate([
        { $match: match },
        {
            $group: {
                _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
                revenue: { $sum: '$totalPrice' },
                bookings: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    return {
        groupBy,
        data,
    };
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
                movieTitle: { $first: '$movie.title' },
                totalBookings: { $sum: 1 },
                totalRevenue: { $sum: '$totalPrice' },
                averageTicketPrice: { $avg: '$totalPrice' },
            },
        },
        { $sort: { totalRevenue: -1 } },
        { $limit: limit },
    ]);

    return movieStats;
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
