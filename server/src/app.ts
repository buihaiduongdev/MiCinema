/**
 * Express App Setup
 *
 * Middleware theo thứ tự:
 * 1. cors (config/cors)
 * 2. express.json()
 * 3. express.urlencoded({ extended: true })
 * 4. Routes: app.use('/api', routes)
 * 5. Error handler middleware (cuối cùng)
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
 * - /api/persons → person.routes
 * - /api/genres → genre.routes
 */
import express, { Application } from 'express';
import cors from 'cors';
import { corsOptions } from './config/cors';

import authRoutes from './modules/auth/auth.routes.js';
import roomRoutes from './modules/rooms/room.routes.js';
import showtimeRoutes from './modules/showtimes/showtime.routes.js';
import bookingRoutes from './modules/bookings/booking.routes.js';
import loyaltyRoutes from './modules/loyalty/loyalty.routes.js';
import movieRoutes from './modules/movies/movie.routes.js';
import personRoutes from './modules/persons/person.routes.js';
import genreRoutes from './modules/genres/genre.routes.js';
import cinemaRoutes from './modules/cinemas/cinema.routes.js';

import foodRoutes from './modules/food/food.routes.js';
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
app.use('/api/users', userRoutes);
app.use('/api/loyalty', loyaltyRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/persons', personRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/cinemas', cinemaRoutes);
app.use('/api/showtimes', showtimeRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/products', foodRoutes);

app.use(errorHandler);

export default app;
