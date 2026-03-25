import { Modal, Text, Group, type ModalProps } from '@mantine/core';
import type React from 'react';
import { Button } from './Button';

export interface ConfirmDialogProps extends Omit<
  ModalProps,
  'opened' | 'onClose' | 'title' | 'children'
> {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: React.ReactNode;
  message?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  danger?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  opened,
  onClose,
  onConfirm,
  title = 'Xác nhận thao tác',
  message = 'Bạn có chắc chắn muốn tiếp tục?',
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  loading = false,
  danger = false,
  ...modalProps
}) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      centered
      radius="lg"
      classNames={{
        title: 'font-semibold',
        body: 'pt-2',
      }}
      {...modalProps}
    >
      <div className="space-y-5">
        <Text size="sm" c="dimmed" className="leading-relaxed">
          {message}
        </Text>

        <Group justify="flex-end" gap="sm">
          <Button variant="default" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            color={danger ? 'red' : 'blue'}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </Group>
      </div>
    </Modal>
  );
};
