import { useEffect, useState } from 'react';
import {
  Button,
  NumberInput,
  Select,
  Switch,
  TextInput,
  Textarea,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import type { CreateComboInput } from '@shared/schemas/food.schema';
import type { AdminProductDetail } from '../hooks/useFoodCRUD';
import { useCreateCombo, useUpdateProduct } from '../hooks/useFoodCRUD';

const inputStyles = {
  input: {
    backgroundColor: '#060e20',
    border: 'none',
    color: '#dae2fd',
  },
};

type Line = { productId: string; quantity: number };

type Props = {
  /** Có id = chế độ sửa combo */
  comboId?: string;
  detail?: AdminProductDetail | null;
  retailOptions: { value: string; label: string }[];
  onSuccess: () => void;
};

export function ComboForm({
  comboId,
  detail,
  retailOptions,
  onSuccess,
}: Props) {
  const isEdit = !!comboId;
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | string>('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number | string>('');
  const [isActive, setIsActive] = useState(true);
  const [lines, setLines] = useState<Line[]>([{ productId: '', quantity: 1 }]);

  const createCombo = useCreateCombo();
  const updateProduct = useUpdateProduct();

  useEffect(() => {
    if (isEdit && detail) {
      setName(detail.name);
      setPrice(detail.price);
      setImage(detail.image);
      setDescription(detail.description ?? '');
      setIsActive(detail.isActive);
      setDiscountPercent(
        detail.discountPercent != null ? detail.discountPercent : '',
      );
      const mapped =
        detail.comboItems?.map((ci) => {
          const ref = ci.productId as
            | { _id: string }
            | string
            | undefined
            | null;
          const productId =
            ref && typeof ref === 'object' && '_id' in ref
              ? ref._id
              : String(ref ?? '');
          return { productId, quantity: ci.quantity };
        }) ?? [];
      setLines(mapped.length ? mapped : [{ productId: '', quantity: 1 }]);
    }
    if (!isEdit) {
      setName('');
      setPrice('');
      setImage('');
      setDescription('');
      setDiscountPercent('');
      setIsActive(true);
      setLines([{ productId: '', quantity: 1 }]);
    }
  }, [isEdit, detail]);

  const addLine = () =>
    setLines((prev) => [...prev, { productId: '', quantity: 1 }]);
  const removeLine = (i: number) =>
    setLines((prev) =>
      prev.length <= 1 ? prev : prev.filter((_, j) => j !== i),
    );
  const setLine = (i: number, patch: Partial<Line>) =>
    setLines((prev) =>
      prev.map((row, j) => (j === i ? { ...row, ...patch } : row)),
    );

  const handleSubmit = async () => {
    if (!name.trim() || !image.trim()) {
      notifications.show({
        color: 'red',
        title: 'Thiếu thông tin',
        message: 'Nhập tên combo và URL ảnh.',
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
    const comboItems = lines
      .filter((l) => l.productId)
      .map((l) => ({
        productId: l.productId,
        quantity: Math.max(1, Math.floor(l.quantity)),
      }));
    if (!comboItems.length) {
      notifications.show({
        color: 'red',
        title: 'Thiếu thành phần',
        message: 'Chọn ít nhất một sản phẩm trong combo.',
      });
      return;
    }

    let discountPercentPayload: number | null | undefined;
    if (typeof discountPercent === 'number') {
      discountPercentPayload = Math.min(100, Math.max(0, discountPercent));
    } else if (discountPercent === '') {
      discountPercentPayload = isEdit ? null : undefined;
    } else {
      const n = Number(discountPercent);
      discountPercentPayload = Number.isFinite(n)
        ? Math.min(100, Math.max(0, n))
        : isEdit
          ? null
          : undefined;
    }

    try {
      if (isEdit && comboId) {
        await updateProduct.mutateAsync({
          id: comboId,
          body: {
            name: name.trim(),
            price: p,
            image: image.trim(),
            description: description.trim(),
            isActive,
            comboItems,
            discountPercent:
              discountPercentPayload === undefined
                ? null
                : discountPercentPayload,
          },
        });
        notifications.show({
          color: 'green',
          title: 'Đã lưu',
          message: 'Cập nhật combo thành công.',
        });
      } else {
        const body: CreateComboInput = {
          name: name.trim(),
          price: p,
          image: image.trim(),
          comboItems,
          ...(description.trim() ? { description: description.trim() } : {}),
        };
        if (
          discountPercentPayload !== undefined &&
          discountPercentPayload !== null
        ) {
          body.discountPercent = discountPercentPayload;
        }
        await createCombo.mutateAsync(body);
        notifications.show({
          color: 'green',
          title: 'Thành công',
          message: 'Đã tạo combo.',
        });
      }
      onSuccess();
    } catch (e: unknown) {
      notifications.show({
        color: 'red',
        title: 'Lỗi',
        message: e instanceof Error ? e.message : 'Không lưu được.',
      });
    }
  };

  const pending = isEdit ? updateProduct.isPending : createCombo.isPending;

  return (
    <div className="space-y-4">
      <TextInput
        label="Tên combo"
        placeholder="Ví dụ: Bắp + 2 nước"
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
        styles={inputStyles}
        labelProps={{ style: { color: '#c2c6d8' } }}
      />
      <NumberInput
        label="Giá bán combo (VNĐ)"
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
      <NumberInput
        label="Giảm giá (%) — gợi ý so với giá lẻ"
        min={0}
        max={100}
        value={discountPercent}
        onChange={(v) => setDiscountPercent(typeof v === 'number' ? v : '')}
        styles={inputStyles}
        labelProps={{ style: { color: '#c2c6d8' } }}
      />
      <Textarea
        label="Mô tả (tuỳ chọn)"
        value={description}
        onChange={(e) => setDescription(e.currentTarget.value)}
        minRows={2}
        styles={inputStyles}
        labelProps={{ style: { color: '#c2c6d8' } }}
      />
      {isEdit && (
        <Switch
          label="Đang bán"
          checked={isActive}
          onChange={(e) => setIsActive(e.currentTarget.checked)}
          styles={{ label: { color: '#c2c6d8' } }}
        />
      )}

      <div className="space-y-2">
        <p className="text-sm font-semibold text-[#c2c6d8]">Thành phần</p>
        {lines.map((line, i) => (
          <div key={i} className="flex flex-wrap gap-2 items-end">
            <Select
              placeholder="Sản phẩm lẻ"
              data={retailOptions}
              value={line.productId || null}
              onChange={(v) => setLine(i, { productId: v ?? '' })}
              searchable
              className="flex-1 min-w-[200px]"
              styles={{
                input: {
                  backgroundColor: '#060e20',
                  border: 'none',
                  color: '#dae2fd',
                },
              }}
            />
            <NumberInput
              label="SL"
              min={1}
              value={line.quantity}
              onChange={(v) =>
                setLine(i, {
                  quantity: typeof v === 'number' ? v : 1,
                })
              }
              w={90}
              styles={inputStyles}
              labelProps={{ style: { color: '#c2c6d8' } }}
            />
            <Button
              type="button"
              variant="subtle"
              color="red"
              size="xs"
              onClick={() => removeLine(i)}
            >
              Xoá dòng
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="light"
          size="xs"
          onClick={addLine}
          styles={{
            root: { backgroundColor: '#222a3d', color: '#dae2fd' },
          }}
        >
          + Thêm dòng
        </Button>
      </div>

      <Button
        fullWidth
        loading={pending}
        onClick={() => void handleSubmit()}
        styles={{ root: { background: '#0066ff', fontWeight: 700 } }}
      >
        {isEdit ? 'Lưu combo' : 'Tạo combo'}
      </Button>
    </div>
  );
}
