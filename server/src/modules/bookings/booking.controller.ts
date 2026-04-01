import { Request, Response } from 'express';
import * as bookingService from './booking.service.js';
import { responseSuccess } from 'src/utils/response.js';
import type { AdminBookingListQuery } from '@shared/schemas/booking.schema.js';
import { log } from 'node:console';

export const getSeats = async (req: Request, res: Response) => {
  const { showtimeId } = req.params;
  const data = await bookingService.getSeatMap(showtimeId as string);

  res.status(200).json(responseSuccess(data, 'Lấy sơ đồ ghế thành công'));
};

export const createBooking = async (req: Request, res: Response) => {
  const userId = (req as any).user._id;
  const booking = await bookingService.createBooking(userId, req.body);

  res.status(200).json(responseSuccess(booking, 'Đặt vé thành công'));
};

export const getMyBookings = async (req: Request, res: Response) => {
  const userId = (req as any).user._id;

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

/** PATCH .../confirm-payment — STAFF/ADMIN: PENDING → PAID (thanh toán tại quầy / xác nhận). */
export const confirmPayment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const booking = await bookingService.markBookingPaid(id as string);

  res
    .status(200)
    .json(responseSuccess(booking, 'Xác nhận thanh toán thành công'));
};

/** GET /admin — UC-24: danh sách đặt vé + lọc (STAFF/ADMIN) */
export const listBookingsAdmin = async (req: Request, res: Response) => {
  const data = await bookingService.getAdminList(
    req.query as unknown as AdminBookingListQuery,
  );

  res
    .status(200)
    .json(responseSuccess(data, 'Lấy danh sách đặt vé thành công'));
};

export const cancelBooking = async (req: Request, res: Response) => {
  const userId = (req as any).user._id;
  const { id } = req.params;
  const booking = await bookingService.cancelBooking(userId, id as string);
  res.status(200).json(responseSuccess(booking, 'Hủy đơn đặt vé thành công'));
};
