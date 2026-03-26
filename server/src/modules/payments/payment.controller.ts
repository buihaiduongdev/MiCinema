import { Request, Response } from 'express';
import { Booking } from '../../models/Booking.model';
import { createVNPayUrl } from './payment.service';
import { responseSuccess, responseError } from '../../utils/response';

/**
 * API: POST /api/payments/pay
 */
export const handlePayment = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.body;

    // 1. Tìm đơn đặt vé trong DB
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res
        .status(404)
        .json(responseError('Không tìm thấy thông tin đặt vé'));
    }

    const ipAddr =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      '127.0.0.1';

    const paymentUrl = createVNPayUrl(
      req,
      booking._id.toString(),
      booking.totalPrice,
      ipAddr as string,
    );

    res.json(responseSuccess({ paymentUrl }));
  } catch (error: any) {
    res.status(500).json(responseError(error.message));
  }
};
