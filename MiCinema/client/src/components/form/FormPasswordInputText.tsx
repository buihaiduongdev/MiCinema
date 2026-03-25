import { PasswordInput, type PasswordInputProps } from '@mantine/core';
import type { AnyFieldApi } from '@tanstack/react-form';

interface FormInputTextProps extends PasswordInputProps {
  field: AnyFieldApi;
}

export function FormPasswordInputText({ field, ...props }: FormInputTextProps) {
  return (
    <PasswordInput
      {...props}
      name={field.name}
      type="password"
      value={field.state.value ?? ''}
      onBlur={field.handleBlur}
      onChange={(e) => field.handleChange(e.target.value)}
      error={
        field.state.meta.isTouched && field.state.meta.errors.length
          ? field.state.meta.errors
              .map((err) => (typeof err === 'object' ? err.message : err))
              .join(', ')
          : undefined
      }
    />
  );
}
