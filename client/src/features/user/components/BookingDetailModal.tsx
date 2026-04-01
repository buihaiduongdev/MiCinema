import {
  Modal,
  Table,
  Group,
  Text,
  Divider,
  Button,
  Stack,
  Loader,
  Box,
  Center,
} from '@mantine/core';
import { IconTrash, IconToolsKitchen2 } from '@tabler/icons-react';
import { useFoodOrdersByBooking } from '@/features/food/hooks/useOrderFood';

export default function BookingDetailModal({
  bookingId,
  opened,
  onClose,
  onCancel,
  status,
}: any) {
  const { data: foodOrders, isLoading } = useFoodOrdersByBooking(bookingId);
  const allItems = foodOrders?.flatMap((order: any) => order.items) || [];
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Chi tiết Ticket & Food"
      centered
      size="lg"
      radius="md"
      styles={{
        content: {
          backgroundColor: '#0f172a',
          border: '1px solid rgba(255,255,255,0.1)',
        },
        header: { backgroundColor: '#0f172a' },
      }}
    >
      <Stack gap="xl">
        <Box
          p="md"
          style={{
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
          }}
        >
          <Group justify="space-between">
            <Stack gap={0}>
              <Text size="sm" c="gray.5">
                Trạng thái vé
              </Text>
              <Text fw={700} color={status === 'PAID' ? 'green' : 'yellow'}>
                {status}
              </Text>
            </Stack>
            {status === 'PENDING' && (
              <Button
                color="red"
                variant="light"
                leftSection={<IconTrash size={16} />}
                onClick={onCancel}
              >
                Hủy đặt vé
              </Button>
            )}
          </Group>
        </Box>

        <Divider label="Danh sách đồ ăn đã đặt" labelPosition="center" />

        {/* Phần 2: Danh sách đồ ăn */}
        <Box>
          {isLoading ? (
            <Center py="xl">
              <Loader size="sm" />
            </Center>
          ) : allItems.length > 0 ? (
            <Table verticalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th c="white">Sản phẩm</Table.Th>
                  <Table.Th c="white" ta="center">
                    Số lượng
                  </Table.Th>
                  <Table.Th c="white" ta="right">
                    Thành tiền
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {allItems.map((item: any, idx: number) => (
                  <Table.Tr key={idx}>
                    <Table.Td c="white">
                      <Group gap="sm">
                        <IconToolsKitchen2 size={16} color="gray" />
                        <Text size="sm">{item.productName}</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td c="white" ta="center">
                      {item.quantity}
                    </Table.Td>
                    <Table.Td c="white" ta="right">
                      {(item.unitPrice * item.quantity).toLocaleString('vi-VN')}
                      đ
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          ) : (
            <Text ta="center" py="xl" c="gray.5">
              Không có đồ ăn kèm trong đơn hàng này.
            </Text>
          )}
        </Box>
      </Stack>
    </Modal>
  );
}
