/**
 * usePayment — Xử lý thanh toán
 * 
 * Dùng: useMutation
 * mutationFn: POST /api/payments { maDatVe, phuongThucTT }
 * onSuccess: invalidateQueries(['bookings']), navigate → ticket result
 */
