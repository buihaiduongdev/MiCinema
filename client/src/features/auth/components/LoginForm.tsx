import { Button, Stack } from '@mantine/core';
import { useForm } from '@tanstack/react-form';
import { loginSchema, type LoginInput } from '@shared/index';
import { FormInputText } from '@/components/form/FormInputText';
import { FormPasswordInputText } from '@/components/form/FormPasswordInputText';
import { useLogin } from '../hooks/useLogin';
export function LoginForm() {
  const { mutate: login, isPending } = useLogin();

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    } as LoginInput,
    validators: { onChange: loginSchema },
    onSubmit: ({ value }) => {
      login(value);
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

        <Button type="submit" mt="md" loading={isPending} fullWidth>
          Đăng nhập
        </Button>
      </Stack>
    </form>
  );
}
