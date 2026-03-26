import { Button, Stack } from '@mantine/core';
import { useForm } from '@tanstack/react-form';
import { loginSchema, type LoginInput } from '@shared/index';
import { FormInputText } from '@/components/form/FormInputText';
import { FormPasswordInputText } from '@/components/form/FormPasswordInputText';
import { useLogin } from '../hooks/useLogin';

export function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const { mutate: login, isPending } = useLogin();

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    } as LoginInput,
    validators: { onChange: loginSchema },
    onSubmit: ({ value }) => {
      login(value, {
        onSuccess: () => {
          onSuccess();
        },
      });
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
              styles={{ label: { color: 'white' } }}
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
              styles={{ label: { color: 'white' } }}
            />
          )}
        />

        <Button
          type="submit"
          mt="xl"
          size="md"
          loading={isPending}
          fullWidth
          variant="gradient"
          gradient={{ from: '#e11d48', to: '#be123c', deg: 90 }}
          style={{
            boxShadow: '0 10px 15px -3px rgba(225, 29, 72, 0.3)',
            height: 48,
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          Đăng nhập
        </Button>
      </Stack>
    </form>
  );
}
