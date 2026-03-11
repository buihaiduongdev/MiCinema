/**
 * useSeatMap — Lấy sơ đồ ghế + trạng thái
 *
 * Dùng: useQuery
 * queryKey: ['seats', showtimeId]
 * queryFn: GET /api/bookings/seats/:showtimeId
 * staleTime: 30 * 1000 (30 giây — cần real-time cho trạng thái ghế)
 * refetchInterval: 30 * 1000 (auto refetch mỗi 30s)
 */
