/**
 * FormField — Reusable UI Component
 *
 * Dùng: Mantine component + Tailwind CSS
 * Props: định nghĩa interface FormFieldProps với TypeScript
 * Export: React.FC<FormFieldProps>
 *
 * Dev phụ A (Tín) phụ trách
 */
import { Input, type InputWrapperProps } from '@mantine/core';
import type React from 'react';

export interface FormFieldProps extends Omit<
  InputWrapperProps,
  'children' | 'labelElement'
> {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  children,
  className,
  contentClassName,
  ...wrapperProps
}) => {
  return (
    <Input.Wrapper
      {...wrapperProps}
      className={['space-y-1', className].filter(Boolean).join(' ')}
      classNames={{
        label: 'text-sm font-semibold text-slate-700',
        required: 'text-red-500',
        description: 'text-xs text-slate-500',
        error: 'text-xs',
      }}
    >
      <div className={contentClassName}>{children}</div>
    </Input.Wrapper>
  );
};
