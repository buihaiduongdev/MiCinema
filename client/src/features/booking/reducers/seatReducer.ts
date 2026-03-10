/**
 * seatReducer — Quản lý state chọn ghế (useReducer)
 * 
 * State: { selectedSeats: Map<string, Seat>, totalPrice: number, maxSeats: number }
 * 
 * Actions:
 * - SELECT_SEAT: thêm ghế vào Map, cập nhật totalPrice
 * - DESELECT_SEAT: xoá ghế khỏi Map, cập nhật totalPrice
 * - RESET: xoá tất cả ghế đã chọn
 * - SET_MAX_SEATS: set giới hạn số ghế tối đa
 * 
 * Lý do dùng useReducer: nhiều action phụ thuộc nhau, state phức tạp (Map + computed)
 */
