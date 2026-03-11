/**
 * Express App Setup
 *
 * Middleware theo thứ tự:
 * 1. cors (config/cors)
 * 2. express.json()
 * 3. express.urlencoded({ extended: true })
 * 4. Morgan logger (dev mode)
 * 5. Routes: app.use('/api', routes)
 * 6. Error handler middleware (cuối cùng)
 *
 * Import routes từ từng module và mount:
 * - /api/auth → auth.routes
 * - /api/movies → movie.routes
 * - /api/showtimes → showtime.routes
 * - /api/rooms → room.routes
 * - /api/bookings → booking.routes
 * - /api/payments → payment.routes
 * - /api/users → user.routes
 * - /api/statistics → statistics.routes
 * - /api/food → food.routes
 * - /api/loyalty → loyalty.routes
 */
import express, { Application } from 'express';
import cors from 'cors';
import { corsOptions } from './config/cors';

import authRoutes from './modules/auth/auth.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app: Application = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res
    .status(200)
    .json({ status: 'OK', message: 'Hệ thống MiCinema đang hoạt động tốt!' });
});

app.use('/api/auth', authRoutes);

app.use(errorHandler);

export default app;
