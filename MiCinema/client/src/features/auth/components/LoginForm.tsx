import { Button, Stack } from '@mantine/core';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
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
    onSubmit: async ({ value }) => {
      login(value);
    },
    validatorAdapter: zodValidator(),
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
        <form.Field name="email">
          {(field) => (
            <FormInputText
              field={field}
              label="Email"
              placeholder="example@gmail.com"
              required
            />
          )}
        </form.Field>
        
        <form.Field name="password">
          {(field) => (
            <FormPasswordInputText
              field={field}
              label="Mật khẩu"
              placeholder="********"
              required
            />
          )}
        </form.Field>

        <Button type="submit" mt="md" loading={isPending} fullWidth>
          Đăng nhập
        </Button>
      </Stack>
    </form>
  );
}
