/**
 * Admin Service — API calls cho các chức năng admin
 *
 * Dùng: apiClient (đã auto attach token)
 */

import apiClient from '../../../lib/api-client';

// --- SHOWTIMES API ---

export const getShowtimes = (params?: Record<string, any>) =>
  apiClient.get('/showtimes', { params });

export const getShowtimeById = (id: string) =>
  apiClient.get(`/showtimes/${id}`);

export const createShowtime = (data: {
  movieId: string;
  cinemaId: string;
  roomId: string;
  startTime: string;
  ticketPrice: number;
}) => apiClient.post('/showtimes', data);

export const updateShowtime = (
  id: string,
  data: {
    movieId?: string;
    cinemaId?: string;
    roomId?: string;
    startTime?: string;
    ticketPrice?: number;
  },
) => apiClient.put(`/showtimes/${id}`, data);

export const cancelShowtime = (id: string) =>
  apiClient.delete(`/showtimes/${id}/cancel`);

// --- HELPER APIs (cho form selects) ---

export const getMoviesForSelect = () =>
  apiClient.get('/movies', {
    params: { limit: 100, sortBy: 'title', sortOrder: 'asc' },
  });

export const getCinemasForSelect = () =>
  apiClient.get('/cinemas', { params: { limit: 100 } });

export const getRoomsByCinema = (cinemaId: string) =>
  apiClient.get('/rooms', { params: { cinemaId, limit: 100 } });
