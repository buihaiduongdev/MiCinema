import {
  SimpleGrid,
  Card,
  Image,
  Stack,
  Group,
  Text,
  Loader,
  Center,
  Badge,
  ActionIcon,
} from '@mantine/core';
import { IconPlus, IconMinus } from '@tabler/icons-react';
import { useFoodMenu } from '../hooks/useFoodMenu';

interface FoodMenuProps {
  onUpdateQuantity: (productId: string, delta: number) => void;
  cart: Record<string, number>;
}

export default function FoodMenu({ onUpdateQuantity, cart }: FoodMenuProps) {
  const { data: menu, isLoading } = useFoodMenu();

  if (isLoading)
    return (
      <Center h="70vh" bg="#020617">
        <Loader color="yellow" size="xl" />
      </Center>
    );

  const products = menu?.data || [];
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
      {products.map((product) => (
        <Card
          key={product._id}
          radius="lg"
          bg="#0f172a"
          style={{
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
          }}
        >
          <Card.Section>
            <Image src={product.image} height={180} alt={product.name} />
          </Card.Section>
          <Stack mt="md" gap="xs">
            <Group justify="space-between" wrap="nowrap">
              <Text fw={800} c="yellow.4" size="lg" lineClamp={1}>
                {product.name}
              </Text>
              <Badge color="yellow" variant="outline" size="sm">
                {product.category}
              </Badge>
            </Group>

            <Text size="xs" c="gray.5" lineClamp={2} h={35}>
              {product.description || 'Sản phẩm chất lượng từ MiCinema.'}
            </Text>
            <Group justify="space-between" mt="sm">
              <Text fw={900} size="xl" c="white">
                {product.price.toLocaleString('vi-VN')}đ
              </Text>

              <Group gap="xs">
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  radius="xl"
                  onClick={() => onUpdateQuantity(product._id, -1)}
                >
                  <IconMinus size={16} />
                </ActionIcon>

                <Text fw={700} w={20} ta="center" c="white">
                  {cart?.[product._id] || 0}
                </Text>
                <ActionIcon
                  variant="filled"
                  color="yellow"
                  radius="xl"
                  onClick={() => onUpdateQuantity(product._id, 1)}
                >
                  <IconPlus size={16} />
                </ActionIcon>
              </Group>
            </Group>
          </Stack>
        </Card>
      ))}
    </SimpleGrid>
  );
}
