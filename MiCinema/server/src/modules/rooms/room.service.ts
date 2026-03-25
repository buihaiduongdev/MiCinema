import { CinemaRoom, ICinemaRoom, ISeat } from '@/models/CinemaRoom.model';
import { SEAT_TYPE } from '@shared/constants/seat-types';
import { Types } from 'mongoose';

export interface CreateRoomInput {
  name: string;
  rows: number;
  colsPerRow: number;
  type: string;
  seatConfig?: {
    vipRows?: string[];
    sweetboxRows?: string[];
  };
}

export interface UpdateRoomInput {
  name?: string;
  type?: string;
  isActive?: boolean;
}

export class RoomService {
  async create(input: CreateRoomInput): Promise<ICinemaRoom> {
    const seats = this.generateSeats(
      input.rows,
      input.colsPerRow,
      input.seatConfig
    );

    const room = new CinemaRoom({
      name: input.name,
      rows: input.rows,
      colsPerRow: input.colsPerRow,
      type: input.type,
      seats,
    });

    return await room.save();
  }

  async getAll(filter: { isActive?: boolean } = {}): Promise<ICinemaRoom[]> {
    return await CinemaRoom.find(filter).sort({ name: 1 });
  }

  async getById(id: string): Promise<ICinemaRoom | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID không hợp lệ');
    }
    return await CinemaRoom.findById(id);
  }

  async update(
    id: string,
    input: UpdateRoomInput
  ): Promise<ICinemaRoom | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID không hợp lệ');
    }

    return await CinemaRoom.findByIdAndUpdate(id, input, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID không hợp lệ');
    }

    const result = await CinemaRoom.findByIdAndUpdate(id, {
      isActive: false,
    });
    return !!result;
  }

  async updateSeat(
    roomId: string,
    seatId: string,
    updates: Partial<ISeat>
  ): Promise<ICinemaRoom | null> {
    const [row, colStr] = [seatId[0], seatId.slice(1)];
    const col = parseInt(colStr);

    return await CinemaRoom.findOneAndUpdate(
      { _id: roomId, 'seats.row': row, 'seats.col': col },
      {
        $set: {
          'seats.$.type': updates.type,
          'seats.$.isActive': updates.isActive,
        },
      },
      { new: true }
    );
  }

  private generateSeats(
    rows: number,
    colsPerRow: number,
    config?: { vipRows?: string[]; sweetboxRows?: string[] }
  ): ISeat[] {
    const seats: ISeat[] = [];
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (let r = 0; r < rows; r++) {
      const rowLetter = alphabet[r];

      for (let c = 1; c <= colsPerRow; c++) {
        let type: 'NORMAL' | 'VIP' | 'SWEETBOX' = SEAT_TYPE.NORMAL;

        if (config?.vipRows?.includes(rowLetter)) {
          type = SEAT_TYPE.VIP as 'VIP';
        } else if (config?.sweetboxRows?.includes(rowLetter)) {
          type = SEAT_TYPE.SWEETBOX as 'SWEETBOX';
        }

        seats.push({
          row: rowLetter,
          col: c,
          type,
          isActive: true,
        });
      }
    }

    return seats;
  }
}

export const roomService = new RoomService();
