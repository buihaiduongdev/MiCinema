import { Request, Response } from 'express';
import * as bookingService from './booking.service.js';
import { createBookingSchema } from '@shared/schemas/booking.schema.js';
import { responseSuccess } from 'src/utils/response.js';

export const getSeats = async (req: Request, res: Response) => {
  const { showtimeId } = req.params;
  const data = await bookingService.getSeatMap(showtimeId as string);

  res.status(200).json(responseSuccess(data, 'Lấy sơ đồ ghế thành công'));
};

export const createBooking = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const booking = await bookingService.createBooking(userId, req.body);

  res.status(200).json(responseSuccess(booking, 'Đặt vé thành công'));
};

export const getMyBookings = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;

  const page = req.query.page ? Number(req.query.page) : undefined;
  const limit = req.query.limit ? Number(req.query.limit) : undefined;
  const data = await bookingService.getAllByUser(userId, page, limit);

  res.status(200).json(responseSuccess(data, 'Lấy lịch sử đặt vé thành công'));
};

export const getBookingDetail = async (req: Request, res: Response) => {
  const { id } = req.params;
  const booking = await bookingService.getById(id as string);

  res
    .status(200)
    .json(responseSuccess(booking, 'Lấy chi tiết đặt vé thành công'));
};
