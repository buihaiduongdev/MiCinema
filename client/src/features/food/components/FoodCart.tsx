import {
  Paper,
  Title,
  Stack,
  Group,
  Text,
  Divider,
  Button,
  ScrollArea,
  Image,
} from '@mantine/core';
import { IconShoppingCart, IconTrash } from '@tabler/icons-react';
import { useFoodMenu } from '../hooks/useFoodMenu';
import { getProductImageFallback, getProductImageUrl } from '@/utils/image';

interface FoodCartProps {
  cart: Record<string, number>;
  onClear: () => void;
  onCheckout: () => void;
  isPending?: boolean;
}

export default function FoodCart({
  cart = {},
  onClear,
  onCheckout,
  isPending,
}: FoodCartProps) {
  const { data: menu } = useFoodMenu();
  const products = menu?.data || [];

  const cartItems = products.filter((p) => cart[p._id] > 0);

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * cart[item._id],
    0,
  );

  return (
    <Paper
      shadow="xl"
      p="xl"
      radius="lg"
      bg="rgba(15, 23, 42, 0.8)"
      style={{
        border: '1px solid rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 100,
      }}
    >
      <Stack gap="md">
        <Group justify="space-between">
          <Group gap="xs">
            <IconShoppingCart size={24} color="var(--mantine-color-yellow-4)" />
            <Title order={3} c="white">
              Giỏ hàng
            </Title>
          </Group>
          {cartItems.length > 0 && (
            <Button
              variant="subtle"
              color="red"
              size="xs"
              leftSection={<IconTrash size={14} />}
              onClick={onClear}
            >
              Xoá hết
            </Button>
          )}
        </Group>
        <Divider color="white/10" />
        <ScrollArea h={cartItems.length > 0 ? 300 : 'auto'} offsetScrollbars>
          {cartItems.length > 0 ? (
            <Stack gap="sm">
              {cartItems.map((item) => (
                <Group key={item._id} justify="space-between" wrap="nowrap">
                  <Image
                    src={getProductImageUrl(item.image, item.category, 'thumb')}
                    fallbackSrc={getProductImageFallback(item.category)}
                    w={44}
                    h={44}
                    radius="md"
                    fit="cover"
                    alt={item.name}
                    flex="none"
                  />
                  <Stack gap={0} flex={1}>
                    <Text size="sm" fw={600} c="white" lineClamp={1}>
                      {item.name}
                    </Text>
                    <Text size="xs" c="gray.5">
                      {item.price.toLocaleString('vi-VN')}đ x {cart[item._id]}
                    </Text>
                  </Stack>
                  <Text fw={700} c="yellow.4">
                    {(item.price * cart[item._id]).toLocaleString('vi-VN')}đ
                  </Text>
                </Group>
              ))}
            </Stack>
          ) : (
            <Text c="gray.5" ta="center" py="xl">
              Chưa chọn món nào
            </Text>
          )}
        </ScrollArea>
        <Divider color="white/10" />
        <Group justify="space-between">
          <Text c="white" fw={700}>
            Tạm tính:
          </Text>
          <Text size="xl" fw={900} c="yellow.4">
            {totalAmount.toLocaleString('vi-VN')}đ
          </Text>
        </Group>
        <Button
          color="yellow"
          fullWidth
          size="md"
          radius="md"
          disabled={cartItems.length === 0}
          loading={isPending}
          onClick={onCheckout}
        >
          Xác nhận đặt món
        </Button>
      </Stack>
    </Paper>
  );
}
