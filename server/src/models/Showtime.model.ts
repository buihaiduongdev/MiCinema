/**
 * Showtime — Mongoose Model
 *
 * Fields: movieId (ref Movie), roomId (ref CinemaRoom),
 *         startTime, ticketPrice, status (OPEN|FINISHED|CANCELLED)
 *
 * Indexes: { movieId, startTime }, { roomId, startTime }
 */
