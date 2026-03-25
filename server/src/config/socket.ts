import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import { corsOptions } from './cors';

let io: Server;

export const initSocket = (httpServer: HTTPServer): Server => {
  io = new Server(httpServer, {
    cors: corsOptions,
  });

  io.on('connection', (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('join-showtime', (showtimeId: string) => {
      socket.join(`showtime-${showtimeId}`);
      console.log(`Socket ${socket.id} joined showtime-${showtimeId}`);
    });

    socket.on('leave-showtime', (showtimeId: string) => {
      socket.leave(`showtime-${showtimeId}`);
      console.log(`Socket ${socket.id} left showtime-${showtimeId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

export const emitSeatUpdate = (
  showtimeId: string,
  data: {
    seatId: string;
    status: string;
    heldUntil?: Date;
  }
) => {
  const io = getIO();
  io.to(`showtime-${showtimeId}`).emit('seat-updated', data);
};

export const emitBookingUpdate = (
  showtimeId: string,
  data: {
    bookingId: string;
    status: string;
    seats: string[];
  }
) => {
  const io = getIO();
  io.to(`showtime-${showtimeId}`).emit('booking-updated', data);
};
