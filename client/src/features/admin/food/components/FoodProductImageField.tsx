import { useState } from 'react';
import { FileInput, Image, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { uploadFoodProductImage } from '../services/foodUpload.service';
import {
  getProductImageFallback,
  getProductImageUrl,
} from '@/utils/image';

type Props = {
  value: string;
  onChange: (url: string) => void;
  /** Dùng cho ảnh dự phòng khi chưa có / lỗi */
  category?: string;
  disabled?: boolean;
};

export function FoodProductImageField({
  value,
  onChange,
  category,
  disabled,
}: Props) {
  const [uploading, setUploading] = useState(false);

  return (
    <Stack gap="xs">
      {value ? (
        <Image
          src={getProductImageUrl(value, category, 'thumb')}
          fallbackSrc={getProductImageFallback(category)}
          h={160}
          radius="md"
          fit="cover"
          alt="Xem trước"
        />
      ) : (
        <Text size="sm" c="dimmed">
          Chưa chọn ảnh
        </Text>
      )}
      <FileInput
        label="Ảnh sản phẩm"
        description="jpg, png, webp — tối đa 5MB"
        placeholder={uploading ? 'Đang tải lên...' : 'Chọn file từ máy'}
        accept="image/png,image/jpeg,image/webp"
        disabled={disabled || uploading}
        clearable
        styles={{
          label: { color: '#c2c6d8' },
          description: { color: '#8c90a1' },
          input: {
            backgroundColor: '#060e20',
            border: 'none',
            color: '#dae2fd',
          },
        }}
        onChange={async (file) => {
          if (!file) return;
          setUploading(true);
          try {
            const url = await uploadFoodProductImage(file);
            onChange(url);
          } catch (e: unknown) {
            notifications.show({
              color: 'red',
              title: 'Upload thất bại',
              message: e instanceof Error ? e.message : 'Không tải được ảnh.',
            });
          } finally {
            setUploading(false);
          }
        }}
      />
    </Stack>
  );
}
