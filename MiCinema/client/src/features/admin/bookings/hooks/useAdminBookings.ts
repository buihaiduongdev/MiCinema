/**
 * useAdminBookings — Lấy danh sách đặt vé (Admin)
 *
 * Dùng: useQuery + server-side pagination
 * queryKey: ['admin-bookings', { page, status, showtimeId }]
 * queryFn: GET /api/bookings?page=...&status=...
 */
