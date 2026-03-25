import {
  Group,
  Modal as MantineModal,
  Text,
  type ModalProps as MantineModalProps,
} from '@mantine/core';
import type React from 'react';
import { Button } from './Button';

export interface ModalProps extends Omit<
  MantineModalProps,
  'children' | 'opened' | 'onClose' | 'title'
> {
  opened: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  description?: React.ReactNode;
  showFooter?: boolean;
  cancelText?: string;
  confirmText?: string;
  onConfirm?: () => void;
  confirmLoading?: boolean;
  hideCancelButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  opened,
  onClose,
  title,
  children,
  description,
  showFooter = false,
  cancelText = 'Hủy',
  confirmText = 'Xác nhận',
  onConfirm,
  confirmLoading = false,
  hideCancelButton = false,
  ...modalProps
}) => {
  return (
    <MantineModal
      opened={opened}
      onClose={onClose}
      title={title}
      centered
      radius="lg"
      classNames={{
        title: 'text-base font-semibold text-slate-900',
        body: 'pt-1',
      }}
      {...modalProps}
    >
      <div className="space-y-5">
        {description ? (
          <Text size="sm" c="dimmed" className="leading-relaxed">
            {description}
          </Text>
        ) : null}

        {children}

        {showFooter && (
          <Group
            justify="flex-end"
            gap="sm"
            className="pt-2 border-t border-slate-200"
          >
            {!hideCancelButton && (
              <Button
                variant="default"
                onClick={onClose}
                disabled={confirmLoading}
              >
                {cancelText}
              </Button>
            )}
            <Button
              onClick={onConfirm}
              loading={confirmLoading}
              disabled={!onConfirm}
            >
              {confirmText}
            </Button>
          </Group>
        )}
      </div>
    </MantineModal>
  );
};
