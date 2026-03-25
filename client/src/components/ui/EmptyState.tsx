/**
 * EmptyState — Reusable UI Component
 *
 * Dùng: Mantine component + Tailwind CSS
 * Props: định nghĩa interface EmptyStateProps với TypeScript
 * Export: React.FC<EmptyStateProps>
 *
 * Dev phụ A (Tín) phụ trách
 */
import { Stack, Text, ThemeIcon, Title } from '@mantine/core';
import type React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  actionLoading?: boolean;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Không có dữ liệu',
  description = 'Hiện chưa có thông tin để hiển thị.',
  icon,
  actionLabel,
  onAction,
  actionLoading = false,
  className,
}) => {
  const defaultIcon = (
    <svg
      className="w-7 h-7"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M9.172 9a4 4 0 015.656 0M9 15h6m-9 6h12a2 2 0 002-2V7a2 2 0 00-2-2h-2.343a1 1 0 01-.707-.293l-1.414-1.414A1 1 0 0012.828 3h-1.656a1 1 0 00-.707.293L9.05 4.707A1 1 0 018.343 5H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );

  return (
    <div
      className={[
        'rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-8 md:p-10',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Stack align="center" gap="md">
        <ThemeIcon
          size={56}
          radius="xl"
          variant="light"
          color="gray"
          className="text-slate-600"
        >
          {icon ?? defaultIcon}
        </ThemeIcon>

        <Title order={4} ta="center" className="text-slate-900">
          {title}
        </Title>

        <Text
          size="sm"
          c="dimmed"
          ta="center"
          maw={480}
          className="leading-relaxed"
        >
          {description}
        </Text>

        {actionLabel && onAction && (
          <Button mt="xs" onClick={onAction} loading={actionLoading}>
            {actionLabel}
          </Button>
        )}
      </Stack>
    </div>
  );
};
