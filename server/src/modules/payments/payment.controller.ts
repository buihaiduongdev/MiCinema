import { Request, Response } from 'express';
import { Booking } from '../../models/Booking.model';
import { generateVietQRUrl } from './payment.service';
import { responseSuccess, responseError } from '../../utils/response';

/**
 * POST /api/payments/pay — Tạo URL thanh toán VNPay.
 * Xác nhận booking PAID (quầy/online): PATCH /api/booking/:id/confirm-payment (STAFF/ADMIN).
 */
export const handlePayment = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res
        .status(404)
        .json(responseError('Không tìm thấy thông tin đặt vé'));
    }

    let ipAddr =
      req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    if (Array.isArray(ipAddr)) {
      ipAddr = ipAddr[0];
    }
    if (typeof ipAddr === 'string') {
      ipAddr = ipAddr.split(',')[0].trim();
    }
    ipAddr = ipAddr.replace('::ffff:', '');

    const paymentUrl = generateVietQRUrl(booking._id.toString(), 80000);

    res.json(responseSuccess({ paymentUrl }));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi hệ thống';
    res.status(500).json(responseError(message));
  }
};
