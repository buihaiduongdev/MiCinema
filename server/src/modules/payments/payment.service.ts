import crypto from 'crypto';
import type { Request } from 'express';
import qs from 'qs';

export { markBookingPaid as applySuccessfulPayment } from '../bookings/booking.service.js';

const VNP_TMNCODE = '2QXUI4J4';
const VNP_HASHSECRET = 'L9YUXA721W8HHL88TCHW98R76AL3905W';
const VNP_URL = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';

export const createVNPayUrl = (
  _req: Request,
  bookingId: string,
  amount: number,
  ipAddr: string,
) => {
  const date = new Date();
  const createDate = formatDate(date);

  const secretKey = VNP_HASHSECRET;
  const vnpUrl = VNP_URL;
  let vnp_Params: Record<string, string | number> = {};
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = VNP_TMNCODE;
  vnp_Params['vnp_Locale'] = 'vn';
  vnp_Params['vnp_CurrCode'] = 'VND';
  vnp_Params['vnp_TxnRef'] = bookingId;
  vnp_Params['vnp_OrderInfo'] = 'Thanh toan ve xem phim MiCinema';
  vnp_Params['vnp_OrderType'] = 'other';
  vnp_Params['vnp_Amount'] = amount * 100;
  vnp_Params['vnp_ReturnUrl'] = 'http://localhost:5173/booking/result';
  vnp_Params['vnp_IpAddr'] = ipAddr;
  vnp_Params['vnp_CreateDate'] = createDate;
  vnp_Params = sortObject(vnp_Params);
  const signData = qs.stringify(vnp_Params, { encode: false });

  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  const finalUrl =
    vnpUrl +
    '?' +
    qs.stringify(vnp_Params, { encode: true }) +
    '&vnp_SecureHash=' +
    signed;
  return finalUrl;
};

function sortObject(obj: Record<string, string | number>) {
  const sorted: Record<string, string | number> = {};
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
}

function formatDate(date: Date) {
  const pad = (n: number) => (n < 10 ? '0' + n : n);
  return (
    date.getFullYear().toString() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
}
