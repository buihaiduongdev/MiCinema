import { TextInput, type TextInputProps } from '@mantine/core';
import type { AnyFieldApi } from '@tanstack/react-form';

interface FormInputTextProps extends TextInputProps {
  field: AnyFieldApi;
}

export function FormInputText({ field, ...props }: FormInputTextProps) {
  return (
    <TextInput
      {...props}
      name={field.name}
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
