/**
 * useShowtimes — Lấy lịch chiếu theo phim
 *
 * Dùng: useQuery
 * queryKey: ['showtimes', { movieId, date }]
 * queryFn: GET /api/showtimes?movieId=...&date=...
 * staleTime: 1 * 60 * 1000 (1 phút — lịch chiếu cần cập nhật thường xuyên hơn)
 */
