import { Request, Response } from 'express';
import * as ticketService from './ticket.service.js';
import { responseSuccess } from 'src/utils/response.js';
import type { TicketRefundBody } from '@shared/schemas/ticket.schema.js';

/** POST /api/tickets/check-in — UC-25 */
export const checkIn = async (req: Request, res: Response) => {
  const { ticketCode } = req.body as { ticketCode: string };
  const result = await ticketService.checkInByTicketCode(ticketCode);

  const message = result.alreadyCheckedIn
    ? 'Vé đã được check-in trước đó'
    : 'Check-in thành công';

  res.status(200).json(responseSuccess(result, message));
};

/** POST /api/tickets/:ticketId/refund — UC-26 */
export const refund = async (req: Request, res: Response) => {
  const { ticketId } = req.params;
  const result = await ticketService.refundTicket(
    ticketId as string,
    req.body as TicketRefundBody,
  );

  res
    .status(200)
    .json(responseSuccess(result, 'Huỷ vé và hoàn tiền thành công'));
};
