import { useState } from 'react';
import {
  Button,
  NumberInput,
  Select,
  TextInput,
  Textarea,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { PRODUCT_CATEGORY } from '@shared/constants/food-constants';
import type { CreateProductInput } from '@shared/schemas/food.schema';
import { useCreateProduct } from '../hooks/useFoodCRUD';

const inputStyles = {
  input: {
    backgroundColor: '#060e20',
    border: 'none',
    color: '#dae2fd',
  },
};

const CATEGORY_LABELS: Record<string, string> = {
  [PRODUCT_CATEGORY.POPCORN]: 'Bắp / Đồ ăn nhẹ',
  [PRODUCT_CATEGORY.DRINK]: 'Nước uống',
  [PRODUCT_CATEGORY.OTHER]: 'Khác',
};

type Props = {
  onSuccess: () => void;
};

export function ProductForm({ onSuccess }: Props) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | string>('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState<string | null>(PRODUCT_CATEGORY.DRINK);
  const [description, setDescription] = useState('');
  const createProduct = useCreateProduct();

  const categoryData = [
    { value: PRODUCT_CATEGORY.POPCORN, label: CATEGORY_LABELS.POPCORN },
    { value: PRODUCT_CATEGORY.DRINK, label: CATEGORY_LABELS.DRINK },
    { value: PRODUCT_CATEGORY.OTHER, label: CATEGORY_LABELS.OTHER },
  ];

  const handleSubmit = async () => {
    if (!name.trim() || !image.trim() || !category) {
      notifications.show({
        color: 'red',
        title: 'Thiếu thông tin',
        message: 'Nhập tên, URL ảnh và chọn danh mục.',
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

    const body: CreateProductInput = {
      name: name.trim(),
      price: p,
      image: image.trim(),
      category: category as CreateProductInput['category'],
      ...(description.trim() ? { description: description.trim() } : {}),
    };

    try {
      await createProduct.mutateAsync(body);
      notifications.show({
        color: 'green',
        title: 'Thành công',
        message: 'Đã thêm sản phẩm.',
      });
      setName('');
      setPrice('');
      setImage('');
      setCategory(PRODUCT_CATEGORY.DRINK);
      setDescription('');
      onSuccess();
    } catch (e: unknown) {
      notifications.show({
        color: 'red',
        title: 'Lỗi',
        message: e instanceof Error ? e.message : 'Không thêm được sản phẩm.',
      });
    }
  };

  return (
    <div className="space-y-4">
      <TextInput
        label="Tên sản phẩm"
        placeholder="Ví dụ: Bắp caramel"
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
        styles={inputStyles}
        labelProps={{ style: { color: '#c2c6d8' } }}
        required
      />
      <NumberInput
        label="Giá (VNĐ)"
        placeholder="50000"
        min={0}
        thousandSeparator="."
        decimalSeparator=","
        value={price}
        onChange={(v) => setPrice(typeof v === 'number' ? v : '')}
        styles={inputStyles}
        labelProps={{ style: { color: '#c2c6d8' } }}
        required
      />
      <TextInput
        label="URL ảnh"
        placeholder="https://..."
        value={image}
        onChange={(e) => setImage(e.currentTarget.value)}
        styles={inputStyles}
        labelProps={{ style: { color: '#c2c6d8' } }}
        required
      />
      <Select
        label="Danh mục"
        data={categoryData}
        value={category}
        onChange={setCategory}
        styles={inputStyles}
        labelProps={{ style: { color: '#c2c6d8' } }}
        required
      />
      <Textarea
        label="Mô tả (tuỳ chọn)"
        placeholder="Mô tả ngắn..."
        value={description}
        onChange={(e) => setDescription(e.currentTarget.value)}
        minRows={2}
        styles={inputStyles}
        labelProps={{ style: { color: '#c2c6d8' } }}
      />
      <Button
        fullWidth
        loading={createProduct.isPending}
        onClick={() => void handleSubmit()}
        styles={{
          root: { background: '#0066ff', fontWeight: 700 },
        }}
      >
        Thêm sản phẩm
      </Button>
    </div>
  );
}
