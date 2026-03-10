/**
 * SeatSelection — Chọn ghế (PHỨC TẠP)
 * 
 * Dùng: useReducer với seatReducer
 * - dispatch SELECT_SEAT khi click ghế trống
 * - dispatch DESELECT_SEAT khi click ghế đã chọn
 * - Check maxSeats trước khi select
 * 
 * Compose: <SeatMap /> (shared component) + legend loại ghế
 * Data: useSeatMap(showtimeId) lấy ghế + trạng thái đã đặt
 */
