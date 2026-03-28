import { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  NumberInput,
  Switch,
  TextInput,
  Textarea,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import type { AdminProductRow } from '../hooks/useFoodCRUD';
import { useUpdateProduct } from '../hooks/useFoodCRUD';

const inputStyles = {
  input: {
    backgroundColor: '#060e20',
    border: 'none',
    color: '#dae2fd',
  },
};

type Props = {
  product: AdminProductRow | null;
  opened: boolean;
  onClose: () => void;
};

export function EditRetailProductModal({ product, opened, onClose }: Props) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | string>('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const updateProduct = useUpdateProduct();

  useEffect(() => {
    if (product && opened) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setDescription(product.description ?? '');
      setIsActive(product.isActive);
    }
  }, [product, opened]);

  const handleSave = async () => {
    if (!product || !name.trim() || !image.trim()) {
      notifications.show({
        color: 'red',
        title: 'Thiếu thông tin',
        message: 'Nhập tên và URL ảnh.',
      });
      return;
    }
    const p = typeof price === 'number' ? price : Number(price);
    if (!Number.isFinite(p) || p < 0) {
      notifications.show({
        color: 'red',
        title: 'Lỗi',
        message: 'Giá không hợp lệ.',
      });
      return;
    }
    try {
      await updateProduct.mutateAsync({
        id: product._id,
        body: {
          name: name.trim(),
          price: p,
          image: image.trim(),
          description: description.trim(),
          isActive,
        },
      });
      notifications.show({
        color: 'green',
        title: 'Đã lưu',
        message: 'Cập nhật sản phẩm thành công.',
      });
      onClose();
    } catch (e: unknown) {
      notifications.show({
        color: 'red',
        title: 'Lỗi',
        message: e instanceof Error ? e.message : 'Không lưu được.',
      });
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Sửa sản phẩm"
      size="md"
      styles={{
        content: { backgroundColor: '#131b2e' },
        header: { backgroundColor: '#131b2e', color: '#dae2fd' },
        title: { fontWeight: 'bold', fontSize: '1.25rem' },
      }}
    >
      <div className="space-y-4">
        <TextInput
          label="Tên sản phẩm"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          styles={inputStyles}
          labelProps={{ style: { color: '#c2c6d8' } }}
        />
        <NumberInput
          label="Giá (VNĐ)"
          min={0}
          thousandSeparator="."
          decimalSeparator=","
          value={price}
          onChange={(v) => setPrice(typeof v === 'number' ? v : '')}
          styles={inputStyles}
          labelProps={{ style: { color: '#c2c6d8' } }}
        />
        <TextInput
          label="URL ảnh"
          value={image}
          onChange={(e) => setImage(e.currentTarget.value)}
          styles={inputStyles}
          labelProps={{ style: { color: '#c2c6d8' } }}
        />
        <Textarea
          label="Mô tả"
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
          minRows={2}
          styles={inputStyles}
          labelProps={{ style: { color: '#c2c6d8' } }}
        />
        <Switch
          label="Đang bán (tắt = ẩn hết hàng)"
          checked={isActive}
          onChange={(e) => setIsActive(e.currentTarget.checked)}
          styles={{ label: { color: '#c2c6d8' } }}
        />
        <Button
          fullWidth
          loading={updateProduct.isPending}
          onClick={() => void handleSave()}
          styles={{ root: { background: '#0066ff', fontWeight: 700 } }}
        >
          Lưu thay đổi
        </Button>
      </div>
    </Modal>
  );
}
