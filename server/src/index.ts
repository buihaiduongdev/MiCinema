/**
 * Server Entry Point
 *
 * 1. Import dotenv.config()
 * 2. Import connectDB từ config/database
 * 3. Import app từ app.ts
 * 4. Kết nối MongoDB → app.listen(PORT)
 * 5. Bắt unhandled errors
 */

import { createServer } from 'http';
import { env } from './config/env';
import { connectDB } from './config/database';
import { initSocket } from './config/socket';
import { startReleaseExpiredSeatsJob } from './jobs/releaseExpiredSeats';
import app from './app';

import './models/Movie.model';
import './models/CinemaRoom.model';
import './models/Showtime.model';
import './models/Product.model';
import './models/Booking.model';
import './models/User.model';

const startServer = async () => {
  try {
    await connectDB();

    const httpServer = createServer(app);
    
    initSocket(httpServer);

    startReleaseExpiredSeatsJob();

    httpServer.listen(env.PORT, () => {
      console.log(`🚀 Server: http://localhost:${env.PORT}`);
      console.log(`🔌 WebSocket: ws://localhost:${env.PORT}`);
    });
  } catch (errors) {
    console.log('Failed to start: ', errors);
    process.exit(1);
  }
};

startServer();
