/**
 * Payments — tích hợp cổng thanh toán / quầy.
 * Hiện dùng chung logic xác nhận booking PAID với module bookings.
 */
export { markBookingPaid as applySuccessfulPayment } from '../bookings/booking.service.js';
