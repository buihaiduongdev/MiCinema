import { Showtime, IShowtime, ISeatStatus } from '@/models/Showtime.model';
import { CinemaRoom } from '@/models/CinemaRoom.model';
import { SEAT_STATUS, SHOWTIME_STATUS } from '@shared/constants/statuses';
import { PRICE_MULTIPLIER } from '@shared/constants/seat-types';
import { emitSeatUpdate } from '@/config/socket';
import { Types } from 'mongoose';

export interface CreateShowtimeInput {
  movieId: string;
  roomId: string;
  startTime: Date;
  ticketPrice: number;
}

export interface HoldSeatsInput {
  showtimeId: string;
  seats: string[];
  userId: string;
}

export class ShowtimeService {
  async create(input: CreateShowtimeInput): Promise<IShowtime> {
    const room = await CinemaRoom.findById(input.roomId);
    if (!room) {
      throw new Error('Phòng chiếu không tồn tại');
    }

    const seatStatus: ISeatStatus[] = room.seats
      .filter((s) => s.isActive)
      .map((seat) => ({
        seatId: `${seat.row}${seat.col}`,
        status: SEAT_STATUS.AVAILABLE,
      }));

    const showtime = new Showtime({
      ...input,
      seatStatus,
      status: SHOWTIME_STATUS.OPEN,
    });

    return await showtime.save();
  }

  async getById(id: string): Promise<IShowtime | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID không hợp lệ');
    }

    return await Showtime.findById(id)
      .populate('movieId', 'title duration poster')
      .populate('roomId', 'name type');
  }

  async getSeatMap(showtimeId: string) {
    const showtime = await this.getById(showtimeId);
    if (!showtime) {
      throw new Error('Suất chiếu không tồn tại');
    }

    const room = await CinemaRoom.findById(showtime.roomId);
    if (!room) {
      throw new Error('Phòng chiếu không tồn tại');
    }

    const now = new Date();
    const seats = room.seats.map((seat) => {
      const seatId = `${seat.row}${seat.col}`;
      const statusInfo = showtime.seatStatus.find((s) => s.seatId === seatId);

      let status = statusInfo?.status || SEAT_STATUS.AVAILABLE;

      if (
        status === SEAT_STATUS.HELD &&
        statusInfo?.heldUntil &&
        statusInfo.heldUntil < now
      ) {
        status = SEAT_STATUS.AVAILABLE;
      }

      const basePrice = showtime.ticketPrice;
      const multiplier = PRICE_MULTIPLIER[seat.type];
      const price = basePrice * multiplier;

      return {
        id: seatId,
        row: seat.row,
        col: seat.col,
        type: seat.type,
        status,
        price,
        heldUntil: statusInfo?.heldUntil,
      };
    });

    return {
      room: {
        name: room.name,
        rows: room.rows,
        cols: room.colsPerRow,
        type: room.type,
      },
      seats,
      ticketPrice: showtime.ticketPrice,
      priceMultiplier: PRICE_MULTIPLIER,
    };
  }

  async holdSeats(input: HoldSeatsInput): Promise<boolean> {
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        const showtime = await Showtime.findById(input.showtimeId);
        if (!showtime) {
          throw new Error('Suất chiếu không tồn tại');
        }

        const now = new Date();
        const holdUntil = new Date(now.getTime() + 10 * 60 * 1000);

        for (const seatId of input.seats) {
          const seatStatus = showtime.seatStatus.find(
            (s) => s.seatId === seatId
          );

          if (!seatStatus) {
            throw new Error(`Ghế ${seatId} không tồn tại`);
          }

          if (seatStatus.status === SEAT_STATUS.BOOKED) {
            throw new Error(`Ghế ${seatId} đã được đặt`);
          }

          if (
            seatStatus.status === SEAT_STATUS.HELD &&
            seatStatus.heldUntil &&
            seatStatus.heldUntil > now
          ) {
            throw new Error(`Ghế ${seatId} đang được giữ bởi người khác`);
          }

          seatStatus.status = SEAT_STATUS.HELD;
          seatStatus.heldUntil = holdUntil;
        }

        await showtime.save();

        for (const seatId of input.seats) {
          emitSeatUpdate(input.showtimeId, {
            seatId,
            status: SEAT_STATUS.HELD,
            heldUntil: holdUntil,
          });
        }

        return true;
      } catch (error: any) {
        if (error.name === 'VersionError' && retryCount < maxRetries - 1) {
          retryCount++;
          await new Promise((resolve) => setTimeout(resolve, 100 * retryCount));
          continue;
        }
        throw error;
      }
    }

    throw new Error('Không thể giữ ghế sau nhiều lần thử. Vui lòng thử lại.');
  }

  async releaseSeats(showtimeId: string, seats: string[]): Promise<boolean> {
    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) {
      throw new Error('Suất chiếu không tồn tại');
    }

    for (const seatId of seats) {
      const seatStatus = showtime.seatStatus.find((s) => s.seatId === seatId);
      if (seatStatus && seatStatus.status === SEAT_STATUS.HELD) {
        seatStatus.status = SEAT_STATUS.AVAILABLE;
        seatStatus.heldUntil = undefined;

        emitSeatUpdate(showtimeId, {
          seatId,
          status: SEAT_STATUS.AVAILABLE,
        });
      }
    }

    await showtime.save();
    return true;
  }

  async bookSeats(
    showtimeId: string,
    seats: string[],
    bookingId: Types.ObjectId
  ): Promise<boolean> {
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        const showtime = await Showtime.findById(showtimeId);
        if (!showtime) {
          throw new Error('Suất chiếu không tồn tại');
        }

        for (const seatId of seats) {
          const seatStatus = showtime.seatStatus.find(
            (s) => s.seatId === seatId
          );
          if (seatStatus) {
            seatStatus.status = SEAT_STATUS.BOOKED;
            seatStatus.bookingId = bookingId;
            seatStatus.heldUntil = undefined;
          }
        }

        await showtime.save();

        for (const seatId of seats) {
          emitSeatUpdate(showtimeId, {
            seatId,
            status: SEAT_STATUS.BOOKED,
          });
        }

        return true;
      } catch (error: any) {
        if (error.name === 'VersionError' && retryCount < maxRetries - 1) {
          retryCount++;
          await new Promise((resolve) => setTimeout(resolve, 100 * retryCount));
          continue;
        }
        throw error;
      }
    }

    throw new Error('Không thể book ghế sau nhiều lần thử.');
  }

  async releaseExpiredHolds(): Promise<number> {
    const now = new Date();
    const showtimes = await Showtime.find({
      'seatStatus.status': SEAT_STATUS.HELD,
      'seatStatus.heldUntil': { $lt: now },
    });

    let releasedCount = 0;

    for (const showtime of showtimes) {
      for (const seatStatus of showtime.seatStatus) {
        if (
          seatStatus.status === SEAT_STATUS.HELD &&
          seatStatus.heldUntil &&
          seatStatus.heldUntil < now
        ) {
          seatStatus.status = SEAT_STATUS.AVAILABLE;
          seatStatus.heldUntil = undefined;
          releasedCount++;
        }
      }
      await showtime.save();
    }

    return releasedCount;
  }
}

export const showtimeService = new ShowtimeService();
