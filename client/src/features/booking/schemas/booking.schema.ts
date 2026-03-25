import { z } from 'zod';

export const bookingSchema = z.object({
  showtimeId: z.string().min(1, 'Vui lòng chọn suất chiếu'),
  seats: z.array(z.string()).min(1, 'Vui lòng chọn ít nhất 1 ghế'),
  foodItems: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().min(1),
      })
    )
    .optional(),
  phoneNumber: z
    .string()
    .regex(/^0\d{9}$/, 'Số điện thoại phải có 10 số và bắt đầu bằng 0')
    .optional(),
  email: z.string().email('Email không hợp lệ').optional(),
});

export type BookingFormData = z.infer<typeof bookingSchema>;

export const paymentSchema = z.object({
  paymentMethod: z.enum(['CASH', 'MOMO', 'VNPAY', 'ZALOPAY'], {
    required_error: 'Vui lòng chọn phương thức thanh toán',
  }),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;
