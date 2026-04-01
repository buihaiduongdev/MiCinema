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
import { useBookingDetail } from '@/features/booking/hooks/useBooking';

interface BookingDetailModalProps {
  bookingId: string;
  opened: boolean;
  onClose: () => void;
  onCancel?: () => void;
  status: string;
}

interface TicketInfo {
  _id: string;
  row: string;
  col: number;
  ticketCode: string;
}

interface FoodOrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
}

interface FoodOrderData {
  _id: string;
  items: FoodOrderItem[];
}

export default function BookingDetailModal({
  bookingId,
  opened,
  onClose,
  onCancel,
  status,
}: BookingDetailModalProps) {
  const { data: foodOrders, isLoading: isLoadingFood } =
    useFoodOrdersByBooking(bookingId);
  const { data: booking, isLoading: isLoadingBooking } =
    useBookingDetail(bookingId);

  const allItems: FoodOrderItem[] =
    (foodOrders as unknown as FoodOrderData[])?.flatMap(
      (order) => order.items,
    ) || [];
  const tickets =
    ((booking as unknown as { tickets: TicketInfo[] })
      ?.tickets as TicketInfo[]) || [];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Chi tiết Đơn hàng"
      centered
      size="lg"
      radius="md"
      styles={{
        content: {
          backgroundColor: '#020617',
          border: '1px solid rgba(255,255,255,0.1)',
        },
        header: { backgroundColor: '#020617', color: 'white' },
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
          <Group justify="space-between" align="flex-start">
            <Stack gap="xs">
              <Group gap="sm">
                <Text size="sm" c="gray.5">
                  Trạng thái:
                </Text>
                <Text fw={700} color={status === 'PAID' ? 'green' : 'yellow'}>
                  {status}
                </Text>
              </Group>

              {tickets.length > 0 && (
                <Stack gap={6} mt="xs">
                  <Text size="xs" c="gray.5" fw={700} lts={1}>
                    DANH SÁCH VÉ:
                  </Text>
                  {tickets.map((t) => (
                    <Group key={t._id} gap="sm">
                      <Text
                        size="xs"
                        c="white"
                        bg="slate.9"
                        px={8}
                        py={2}
                        style={{
                          borderRadius: '4px',
                          border: '1px solid rgba(255,255,255,0.1)',
                        }}
                      >
                        {t.row}
                        {t.col}
                      </Text>
                      <Text size="xs" c="yellow.5" ff="monospace" fw={600}>
                        {t.ticketCode}
                      </Text>
                    </Group>
                  ))}
                </Stack>
              )}
            </Stack>

            {status === 'PENDING' && (
              <Button
                color="red"
                variant="light"
                size="xs"
                leftSection={<IconTrash size={14} />}
                onClick={onCancel}
              >
                Hủy đặt vé
              </Button>
            )}
          </Group>
        </Box>

        <Divider label="Đồ ăn kèm" labelPosition="center" color="gray.8" />

        <Box>
          {isLoadingFood || isLoadingBooking ? (
            <Center py="xl">
              <Loader size="sm" />
            </Center>
          ) : allItems.length > 0 ? (
            <Table verticalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th c="gray.5">Sản phẩm</Table.Th>
                  <Table.Th c="gray.5" ta="center">
                    Số lượng
                  </Table.Th>
                  <Table.Th c="gray.5" ta="right">
                    Thành tiền
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {allItems.map((item, idx: number) => (
                  <Table.Tr
                    key={idx}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                  >
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
            <Text ta="center" py="xl" c="gray.5" size="sm">
              Không có đồ ăn kèm trong đơn hàng này.
            </Text>
          )}
        </Box>
      </Stack>
    </Modal>
  );
}
