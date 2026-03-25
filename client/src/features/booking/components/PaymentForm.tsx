import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { paymentSchema, type PaymentFormData } from '../schemas/booking.schema';

interface PaymentFormProps {
  onSubmit: (data: PaymentFormData) => void;
  isLoading?: boolean;
}

export function PaymentForm({ onSubmit, isLoading }: PaymentFormProps) {
  const form = useForm({
    defaultValues: {
      paymentMethod: 'MOMO' as const,
    },
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
    validatorAdapter: zodValidator(),
  });

  const paymentMethods = [
    { value: 'MOMO' as const, label: 'MoMo', icon: '📱' },
    { value: 'VNPAY' as const, label: 'VNPay', icon: '💳' },
    { value: 'ZALOPAY' as const, label: 'ZaloPay', icon: '📲' },
    { value: 'CASH' as const, label: 'Tiền mặt', icon: '💵' },
  ];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Chọn phương thức thanh toán
        </label>

        <form.Field
          name="paymentMethod"
          validators={{
            onChange: paymentSchema.shape.paymentMethod,
          }}
        >
          {(field) => (
            <div className="space-y-2">
              {paymentMethods.map((method) => (
                <label
                  key={method.value}
                  className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition"
                >
                  <input
                    type="radio"
                    name={field.name}
                    value={method.value}
                    checked={field.state.value === method.value}
                    onChange={(e) => field.handleChange(e.target.value as any)}
                    className="w-5 h-5"
                  />
                  <span className="text-2xl">{method.icon}</span>
                  <span className="text-white font-medium">{method.label}</span>
                </label>
              ))}

              {field.state.meta.errors && (
                <p className="text-red-500 text-sm mt-1">
                  {field.state.meta.errors.join(', ')}
                </p>
              )}
            </div>
          )}
        </form.Field>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
      >
        {isLoading ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
      </button>
    </form>
  );
}
