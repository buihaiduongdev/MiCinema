/**
 * useMovieDetail — Lấy chi tiết 1 phim
 * 
 * Dùng: useQuery
 * queryKey: ['movies', movieId]
 * queryFn: GET /api/movies/:id
 * enabled: !!movieId (chỉ fetch khi có id)
 */
