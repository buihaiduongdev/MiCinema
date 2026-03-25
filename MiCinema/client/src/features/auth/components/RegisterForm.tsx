import { registerSchema, type RegisterInput } from '@shared/index';
import { useForm } from '@tanstack/react-form';
import { useRegister } from '../hooks/useRegister';
import { Button, Stack } from '@mantine/core';
import { FormInputText } from '@/components/form/FormInputText';
import { FormPasswordInputText } from '@/components/form/FormPasswordInputText';

export function RegisterForm() {
  const { mutate: resgister, isPending } = useRegister();

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
      phone: '',
    } as RegisterInput,
    validators: { onChange: registerSchema },
    onSubmit: ({ value }) => {
      resgister(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <Stack>
        <form.Field
          name="email"
          children={(field) => (
            <FormInputText
              field={field}
              label="Email"
              placeholder="example@gmail.com"
              required
            />
          )}
        />
        <form.Field
          name="password"
          children={(field) => (
            <FormPasswordInputText
              field={field}
              label="Mật khẩu"
              placeholder="********"
              required
            />
          )}
        />
        <form.Field
          name="fullName"
          children={(field) => (
            <FormInputText
              field={field}
              label="Họ tên"
              placeholder="Nguyễn Văn A"
              required
            />
          )}
        />
        <form.Field
          name="phone"
          children={(field) => (
            <FormInputText
              field={field}
              label="Số điện thoại"
              placeholder="09xxx"
            />
          )}
        />
        <Button type="submit" mt="md" loading={isPending} fullWidth>
          Đăng ký
        </Button>
      </Stack>
    </form>
  );
}
