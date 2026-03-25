/**
 * Button — Reusable UI Component
 *
 * Dùng: Mantine component + Tailwind CSS
 * Props: định nghĩa interface ButtonProps với TypeScript
 * Export: React.FC<ButtonProps>
 *
 * Dev phụ A (Tín) phụ trách
 */

import {
  Button as MantineButton,
  type ButtonProps as MantineButtonProps,
} from '@mantine/core';
import type React from 'react';

export interface ButtonProps extends MantineButtonProps {
  className?: string;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  children,
  ...props
}) => {
  const baseClassName =
    'rounded-xl font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60';

  return (
    <MantineButton
      className={[baseClassName, className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </MantineButton>
  );
};
