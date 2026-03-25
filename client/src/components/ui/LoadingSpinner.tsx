/**
 * LoadingSpinner — Reusable UI Component
 *
 * Dùng: Mantine component + Tailwind CSS
 * Props: định nghĩa interface LoadingSpinnerProps với TypeScript
 * Export: React.FC<LoadingSpinnerProps>
 *
 * Dev phụ A (Tín) phụ trách
 */
import { Center, Loader, Text, type LoaderProps } from '@mantine/core';
import type React from 'react';

export interface LoadingSpinnerProps extends LoaderProps {
  label?: React.ReactNode;
  fullScreen?: boolean;
  overlay?: boolean;
  minHeight?: number | string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = 'Đang tải dữ liệu...',
  fullScreen = false,
  overlay = false,
  minHeight = 220,
  className,
  ...loaderProps
}) => {
  const wrapperClassName = [
    'w-full',
    overlay ? 'absolute inset-0 bg-white/70 backdrop-blur-[1px] z-20' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Center
      className={wrapperClassName}
      style={{
        minHeight: fullScreen ? '100vh' : minHeight,
      }}
    >
      <div className="flex flex-col items-center gap-3">
        <Loader size="lg" color="red" {...loaderProps} />
        {label ? (
          <Text size="sm" c="dimmed" fw={500} ta="center">
            {label}
          </Text>
        ) : null}
      </div>
    </Center>
  );
};
