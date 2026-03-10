/**
 * useBooking — Tạo đặt vé
 * 
 * Dùng: useMutation
 * mutationFn: POST /api/bookings { maXuatChieu, danhSachGhe }
 * onSuccess: invalidateQueries(['showtimes']), navigate → /booking/confirm
 */
