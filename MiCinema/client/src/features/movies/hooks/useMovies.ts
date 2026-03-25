/**
 * useMovies — Lấy danh sách phim
 *
 * Dùng: useQuery từ TanStack Query
 * queryKey: ['movies', { genre, status, page }]
 * queryFn: GET /api/movies?genre=...&status=...&page=...
 * staleTime: 5 * 60 * 1000 (5 phút — data phim ít thay đổi)
 */
