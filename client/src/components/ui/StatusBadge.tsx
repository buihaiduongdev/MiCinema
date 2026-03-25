/**
 * StatusBadge — Reusable UI Component
 *
 * Dùng: Mantine component + Tailwind CSS
 * Props: định nghĩa interface StatusBadgeProps với TypeScript
 * Export: React.FC<StatusBadgeProps>
 *
 * Dev phụ A (Tín) phụ trách
 */
import { Badge, type BadgeProps } from '@mantine/core';
import type React from 'react';

type PresetStatus =
  | 'UPCOMING'
  | 'RELEASED'
  | 'ENDED'
  | 'PENDING'
  | 'PAID'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'OPEN'
  | 'FINISHED'
  | 'BRONZE'
  | 'SILVER'
  | 'GOLD'
  | 'EARN'
  | 'REDEEM'
  | 'EXPIRE';

interface StatusMeta {
  label: string;
  color: BadgeProps['color'];
  variant?: BadgeProps['variant'];
}

const STATUS_META: Record<PresetStatus, StatusMeta> = {
  UPCOMING: { label: 'Sắp chiếu', color: 'blue', variant: 'light' },
  RELEASED: { label: 'Đang chiếu', color: 'green', variant: 'light' },
  ENDED: { label: 'Ngừng chiếu', color: 'gray', variant: 'light' },

  PENDING: { label: 'Chờ thanh toán', color: 'yellow', variant: 'light' },
  PAID: { label: 'Đã thanh toán', color: 'green', variant: 'light' },
  CANCELLED: { label: 'Đã hủy', color: 'red', variant: 'light' },
  COMPLETED: { label: 'Hoàn thành', color: 'teal', variant: 'light' },

  OPEN: { label: 'Đang mở bán', color: 'green', variant: 'light' },
  FINISHED: { label: 'Đã kết thúc', color: 'gray', variant: 'light' },

  BRONZE: { label: 'Bronze', color: 'orange', variant: 'light' },
  SILVER: { label: 'Silver', color: 'gray', variant: 'light' },
  GOLD: { label: 'Gold', color: 'yellow', variant: 'light' },

  EARN: { label: 'Cộng điểm', color: 'green', variant: 'light' },
  REDEEM: { label: 'Đổi điểm', color: 'blue', variant: 'light' },
  EXPIRE: { label: 'Hết hạn', color: 'red', variant: 'light' },
};

export interface StatusBadgeProps extends Omit<
  BadgeProps,
  'children' | 'color' | 'variant'
> {
  status: string;
  label?: React.ReactNode;
  color?: BadgeProps['color'];
  variant?: BadgeProps['variant'];
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  color,
  variant,
  className,
  radius = 'sm',
  tt = 'none',
  ...props
}) => {
  const normalizedStatus = status.toUpperCase() as PresetStatus;
  const preset = STATUS_META[normalizedStatus];

  const resolvedLabel = label ?? preset?.label ?? status;
  const resolvedColor = color ?? preset?.color ?? 'gray';
  const resolvedVariant = variant ?? preset?.variant ?? 'light';

  return (
    <Badge
      color={resolvedColor}
      variant={resolvedVariant}
      radius={radius}
      tt={tt}
      className={['font-semibold tracking-wide', className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {resolvedLabel}
    </Badge>
  );
};
