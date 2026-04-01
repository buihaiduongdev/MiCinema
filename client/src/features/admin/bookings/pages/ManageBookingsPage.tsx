import { useMemo, useState } from 'react';
import {
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner';
import { EmptyState } from '../../../../components/ui/EmptyState';
import {
  useAdminBookingsList,
  useConfirmBookingPayment,
  useTicketCheckIn,
  useTicketRefund,
  useVerifyTicket,
  type AdminBookingRow,
} from '../hooks/useAdminBookings';
import { BOOKING_STATUS } from '@shared/constants/statuses';
import {
  CalendarClock,
  Home,
  Ticket,
  CheckCircle,
  LogIn,
  Undo2,
} from 'lucide-react';

function formatUser(booking: AdminBookingRow): string {
  const u = booking.userId;
  if (u && typeof u === 'object' && u !== null && 'email' in u) {
    const o = u as { email?: string; fullName?: string };
    return o.fullName ? `${o.fullName} (${o.email})` : o.email || '—';
  }
  return '—';
}

function formatShowtime(booking: AdminBookingRow): string {
  const s = booking.showtimeId;
  if (!s || typeof s !== 'object' || s === null) return '—';
  const st = s as {
    startTime?: string;
    movieId?: { title?: string };
    roomId?: { name?: string };
  };
  const title = st.movieId?.title || 'Phim';
  const room = st.roomId?.name ? ` · ${st.roomId.name}` : '';
  const time = st.startTime
    ? new Date(st.startTime).toLocaleString('vi-VN')
    : '';
  return `${title}${room}${time ? ` · ${time}` : ''}`;
}

function statusLabel(status: string): string {
  switch (status) {
    case BOOKING_STATUS.PENDING:
      return 'Chờ thanh toán';
    case BOOKING_STATUS.PAID:
      return 'Đã thanh toán';
    case BOOKING_STATUS.CANCELLED:
      return 'Đã huỷ';
    case BOOKING_STATUS.COMPLETED:
      return 'Hoàn tất';
    default:
      return status;
  }
}

interface VerificationPackage {
  booking: any;
  tickets: any[];
  foodOrders: any[];
}

export default function ManageBookingsPage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showtimeId, setShowtimeId] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');

  const { data, isLoading, refetch } = useAdminBookingsList({
    page,
    limit,
    showtimeId: showtimeId.trim() || undefined,
    status: statusFilter,
    customerSearch: customerSearch.trim() || undefined,
  });

  const payload = data?.data;
  const bookings = payload?.bookings ?? [];
  const meta = payload?.meta;

  const confirmPay = useConfirmBookingPayment();
  const checkIn = useTicketCheckIn();
  const refund = useTicketRefund();
  const verifyTicket = useVerifyTicket();

  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkInCode, setCheckInCode] = useState('');
  const [verificationPkg, setVerificationPkg] =
    useState<VerificationPackage | null>(null);

  const [refundOpen, setRefundOpen] = useState(false);
  const [refundTicketId, setRefundTicketId] = useState('');
  const [refundAmount, setRefundAmount] = useState<number | ''>('');
  const [refundReason, setRefundReason] = useState('');

  const statusOptions = useMemo(
    () => [
      { value: 'ALL', label: 'Tất cả trạng thái' },
      { value: BOOKING_STATUS.PENDING, label: 'Chờ thanh toán' },
      { value: BOOKING_STATUS.PAID, label: 'Đã thanh toán' },
      { value: BOOKING_STATUS.CANCELLED, label: 'Đã huỷ' },
      { value: BOOKING_STATUS.COMPLETED, label: 'Hoàn tất' },
    ],
    [],
  );

  const handleConfirmPay = (id: string) => {
    confirmPay.mutate(id, {
      onSuccess: (res) => {
        notifications.show({
          title: 'Thành công',
          message: res?.message || 'Đã xác nhận thanh toán',
          color: 'green',
        });
      },
      onError: (e: Error) => {
        notifications.show({
          title: 'Lỗi',
          message: e.message,
          color: 'red',
        });
      },
    });
  };

  const handleVerify = () => {
    if (!checkInCode.trim()) return;
    verifyTicket.mutate(checkInCode.trim(), {
      onSuccess: (res) => {
        setVerificationPkg(res.data as VerificationPackage);
      },
      onError: (e: Error) => {
        notifications.show({
          title: 'Lỗi',
          message: e.message,
          color: 'red',
        });
      },
    });
  };

  const handleSingleCheckIn = (code: string) => {
    checkIn.mutate(code, {
      onSuccess: (res) => {
        notifications.show({
          title: 'Check-in',
          message: res?.message || 'Thành công',
          color: 'green',
        });
        handleVerify();
        refetch();
      },
      onError: (e: Error) => {
        notifications.show({
          title: 'Lỗi',
          message: e.message,
          color: 'red',
        });
      },
    });
  };

  const submitCheckIn = () => {
    if (!checkInCode.trim()) return;
    checkIn.mutate(checkInCode.trim(), {
      onSuccess: (res) => {
        notifications.show({
          title: 'Check-in',
          message: res?.message || 'Thành công',
          color: 'green',
        });
        setCheckInOpen(false);
        setCheckInCode('');
        setVerificationPkg(null);
        refetch();
      },
      onError: (e: Error) => {
        notifications.show({
          title: 'Lỗi',
          message: e.message,
          color: 'red',
        });
      },
    });
  };

  const submitRefund = () => {
    if (!refundTicketId.trim()) return;
    refund.mutate(
      {
        ticketId: refundTicketId.trim(),
        refundAmount: refundAmount === '' ? undefined : Number(refundAmount),
        reason: refundReason.trim() || undefined,
      },
      {
        onSuccess: (res) => {
          notifications.show({
            title: 'Hoàn vé',
            message: res?.message || 'Thành công',
            color: 'green',
          });
          setRefundOpen(false);
          setRefundTicketId('');
          setRefundAmount('');
          setRefundReason('');
          refetch();
        },
        onError: (e: Error) => {
          notifications.show({
            title: 'Lỗi',
            message: e.message,
            color: 'red',
          });
        },
      },
    );
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="w-full min-w-0 px-6 md:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-2 mb-8">
        <div className="min-w-0">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#dae2fd] mb-2">
            Quản lý đặt vé
          </h1>
          <p className="text-[#c2c6d8] flex items-center gap-2 text-sm">
            <Home size={14} />
            <span>Admin</span>
            <span className="text-[#8c90a1]">/</span>
            <span>Đặt vé</span>
          </p>
        </div>
        <Group gap="sm">
          <Button
            leftSection={<LogIn size={16} />}
            variant="light"
            color="blue"
            onClick={() => setCheckInOpen(true)}
          >
            Check-in vé
          </Button>
          <Button
            leftSection={<Undo2 size={16} />}
            variant="light"
            color="orange"
            onClick={() => setRefundOpen(true)}
          >
            Hoàn vé
          </Button>
        </Group>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
        <div className="lg:col-span-3">
          <Select
            label="Trạng thái"
            data={statusOptions}
            value={statusFilter}
            onChange={(v) => {
              setStatusFilter(v || 'ALL');
              setPage(1);
            }}
            classNames={{
              label: 'text-[#c2c6d8]',
              input: 'bg-[#060e20] border-[#2a3142] text-[#dae2fd]',
            }}
          />
        </div>
        <div className="lg:col-span-3">
          <TextInput
            label="Suất chiếu (ID)"
            placeholder="ObjectId suất chiếu"
            value={showtimeId}
            onChange={(e) => {
              setShowtimeId(e.target.value);
              setPage(1);
            }}
            classNames={{
              label: 'text-[#c2c6d8]',
              input: 'bg-[#060e20] border-[#2a3142] text-[#dae2fd]',
            }}
          />
        </div>
        <div className="lg:col-span-4">
          <TextInput
            label="Khách (email / tên)"
            placeholder="Tìm theo email hoặc họ tên"
            value={customerSearch}
            onChange={(e) => {
              setCustomerSearch(e.target.value);
              setPage(1);
            }}
            classNames={{
              label: 'text-[#c2c6d8]',
              input: 'bg-[#060e20] border-[#2a3142] text-[#dae2fd]',
            }}
          />
        </div>
        <div className="lg:col-span-2 flex items-end">
          <Button
            variant="outline"
            color="gray"
            fullWidth
            onClick={() => refetch()}
            className="border-[#2a3142] text-[#dae2fd]"
          >
            Làm mới
          </Button>
        </div>
      </div>

      {bookings.length === 0 ? (
        <EmptyState
          icon={<Ticket className="w-12 h-12 text-[#8c90a1]" />}
          title="Không có đặt vé"
          description="Thử đổi bộ lọc hoặc tạo đặt vé mới từ trang đặt vé."
        />
      ) : (
        <div className="rounded-2xl border border-[#2a3142] bg-[#131b2e]/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[#8c90a1] border-b border-[#2a3142] bg-[#0b1326]/60">
                <tr>
                  <th className="px-4 py-3 font-semibold">Mã đơn</th>
                  <th className="px-4 py-3 font-semibold">Khách</th>
                  <th className="px-4 py-3 font-semibold">Suất / phim</th>
                  <th className="px-4 py-3 font-semibold">Ghế</th>
                  <th className="px-4 py-3 font-semibold">Tổng</th>
                  <th className="px-4 py-3 font-semibold">Trạng thái</th>
                  <th className="px-4 py-3 font-semibold text-right">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="text-[#dae2fd] divide-y divide-[#2a3142]">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-[#171f33]/80">
                    <td className="px-4 py-3 font-mono text-xs text-[#b3c5ff]">
                      {b._id.slice(-8)}
                    </td>
                    <td className="px-4 py-3 max-w-[200px] truncate">
                      {formatUser(b)}
                    </td>
                    <td className="px-4 py-3 max-w-[260px]">
                      <div className="flex items-start gap-2">
                        <CalendarClock
                          size={14}
                          className="text-[#8c90a1] mt-0.5 shrink-0"
                        />
                        <span className="text-[#c2c6d8] line-clamp-2">
                          {formatShowtime(b)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{b.seats?.length ?? 0}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {(b.totalPrice ?? 0).toLocaleString('vi-VN')} đ
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-lg text-xs font-medium ${
                          b.status === BOOKING_STATUS.PENDING
                            ? 'bg-amber-500/15 text-amber-200'
                            : b.status === BOOKING_STATUS.PAID
                              ? 'bg-emerald-500/15 text-emerald-200'
                              : b.status === BOOKING_STATUS.CANCELLED
                                ? 'bg-red-500/15 text-red-200'
                                : 'bg-slate-500/15 text-slate-200'
                        }`}
                      >
                        {statusLabel(b.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {b.status === BOOKING_STATUS.PENDING && (
                        <Button
                          size="xs"
                          variant="light"
                          color="teal"
                          leftSection={<CheckCircle size={14} />}
                          loading={confirmPay.isPending}
                          onClick={() => handleConfirmPay(b._id)}
                        >
                          Xác nhận thanh toán
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <Group justify="center" mt="xl" gap="md">
          <Button
            variant="default"
            disabled={!meta.hasPrevPage}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="bg-[#131b2e] text-[#dae2fd]"
          >
            Trước
          </Button>
          <Text size="sm" className="text-[#c2c6d8]">
            Trang {meta.page} / {meta.totalPages} ({meta.totalItems} đơn)
          </Text>
          <Button
            variant="default"
            disabled={!meta.hasNextPage}
            onClick={() => setPage((p) => p + 1)}
            className="bg-[#131b2e] text-[#dae2fd]"
          >
            Sau
          </Button>
        </Group>
      )}

      <Modal
        opened={checkInOpen}
        onClose={() => {
          setCheckInOpen(false);
          setVerificationPkg(null);
        }}
        title="Check-in vé & Đồ ăn"
        size="xl"
        styles={{
          content: { backgroundColor: '#020617', border: '1px solid #2a3142' },
          header: { backgroundColor: '#020617', color: '#dae2fd' },
          body: { backgroundColor: '#020617' },
        }}
      >
        <Stack gap="xl">
          <Group align="flex-end">
            <TextInput
              label="Mã vé"
              placeholder="Nhập mã vé bất kỳ trong đơn..."
              value={checkInCode}
              onChange={(e) => setCheckInCode(e.target.value)}
              style={{ flex: 1 }}
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
            />
            <Button
              loading={verifyTicket.isPending}
              onClick={handleVerify}
              variant="filled"
              color="blue"
            >
              Kiểm tra đơn
            </Button>
          </Group>

          {verificationPkg && (
            <Stack gap="lg">
              <div className="p-4 rounded-xl bg-[#0f172a] border border-[#1e293b]">
                <Text fw={700} size="lg" c="blue.4" mb="xs">
                  Thông tin phim
                </Text>
                <Group gap="xl">
                  <Stack gap={4}>
                    <Text size="xs" c="gray.5">
                      Phim
                    </Text>
                    <Text c="white" fw={600}>
                      {verificationPkg.booking.showtimeId.movieId.title}
                    </Text>
                  </Stack>
                  <Stack gap={4}>
                    <Text size="xs" c="gray.5">
                      Suất chiếu
                    </Text>
                    <Text c="white" fw={600}>
                      {new Date(
                        verificationPkg.booking.showtimeId.startTime,
                      ).toLocaleString('vi-VN')}
                    </Text>
                  </Stack>
                  <Stack gap={4}>
                    <Text size="xs" c="gray.5">
                      Phòng
                    </Text>
                    <Text c="white" fw={600}>
                      {verificationPkg.booking.showtimeId.roomId.name}
                    </Text>
                  </Stack>
                </Group>
              </div>

              <div>
                <Text fw={700} c="white" mb="sm">
                  Danh sách ghế ({verificationPkg.tickets.length})
                </Text>
                <div className="overflow-hidden border border-[#1e293b] rounded-lg">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-[#0f172a] text-[#8c90a1]">
                      <tr>
                        <th className="px-4 py-2 border-b border-[#1e293b]">
                          Ghế
                        </th>
                        <th className="px-4 py-2 border-b border-[#1e293b]">
                          Mã vé
                        </th>
                        <th className="px-4 py-2 border-b border-[#1e293b]">
                          Trạng thái
                        </th>
                        <th className="px-4 py-2 border-b border-[#1e293b] text-right">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-[#020617] text-white">
                      {verificationPkg.tickets.map((t) => (
                        <tr key={t._id} className="hover:bg-white/5">
                          <td className="px-4 py-3 border-b border-[#1e293b] font-bold">
                            {t.row}
                            {t.col}
                          </td>
                          <td className="px-4 py-3 border-b border-[#1e293b] font-mono text-blue-400">
                            {t.ticketCode}
                          </td>
                          <td className="px-4 py-3 border-b border-[#1e293b]">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                t.status === 'USED'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : 'bg-blue-500/20 text-blue-400'
                              }`}
                            >
                              {t.status === 'USED'
                                ? 'ĐÃ CHECK-IN'
                                : 'CHƯA DÙNG'}
                            </span>
                          </td>
                          <td className="px-4 py-3 border-b border-[#1e293b] text-right">
                            {t.status !== 'USED' && (
                              <Button
                                size="compact-xs"
                                variant="light"
                                color="green"
                                loading={checkIn.isPending}
                                onClick={() =>
                                  handleSingleCheckIn(t.ticketCode)
                                }
                              >
                                Check-in
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <Text fw={700} c="white" mb="sm">
                  Đồ ăn kèm ({verificationPkg.foodOrders.length})
                </Text>
                {verificationPkg.foodOrders.length > 0 ? (
                  <div className="overflow-hidden border border-[#1e293b] rounded-lg">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#0f172a] text-[#8c90a1]">
                        <tr>
                          <th className="px-4 py-2 border-b border-[#1e293b]">
                            Sản phẩm
                          </th>
                          <th className="px-4 py-2 border-b border-[#1e293b] text-center">
                            SL
                          </th>
                          <th className="px-4 py-2 border-b border-[#1e293b] text-right">
                            Trạng thái đơn
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-[#020617] text-white">
                        {verificationPkg.foodOrders.flatMap((order) =>
                          order.items.map((item: any, idx: number) => (
                            <tr
                              key={`${order._id}-${idx}`}
                              className="hover:bg-white/5"
                            >
                              <td className="px-4 py-3 border-b border-[#1e293b]">
                                {item.productName}
                              </td>
                              <td className="px-4 py-3 border-b border-[#1e293b] text-center">
                                {item.quantity}
                              </td>
                              <td className="px-4 py-3 border-b border-[#1e293b] text-right">
                                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">
                                  {order.status}
                                </span>
                              </td>
                            </tr>
                          )),
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <Text size="sm" c="gray.6" ta="center" py="md">
                    Không có đồ ăn đi kèm
                  </Text>
                )}
              </div>
            </Stack>
          )}

          {!verificationPkg && (
            <Stack gap="sm">
              <Text size="xs" c="gray.6" ta="center">
                Nhập mã vé để kéo toàn bộ thông tin đơn hàng đi kèm
              </Text>
              <Group justify="center">
                <Button
                  variant="outline"
                  color="gray"
                  onClick={() => setCheckInOpen(false)}
                >
                  Hủy
                </Button>
                <Button
                  color="blue"
                  onClick={submitCheckIn}
                  loading={checkIn.isPending}
                >
                  Check-in nhanh
                </Button>
              </Group>
            </Stack>
          )}
        </Stack>
      </Modal>

      <Modal
        opened={refundOpen}
        onClose={() => setRefundOpen(false)}
        title="Huỷ vé & hoàn tiền"
        styles={{
          content: { backgroundColor: '#020617', border: '1px solid #2a3142' },
          header: { backgroundColor: '#020617', color: '#dae2fd' },
          body: { backgroundColor: '#020617' },
        }}
      >
        <Stack gap="md">
          <Text size="sm" className="text-[#c2c6d8]">
            Nhập ID vé (MongoDB) từ database hoặc công cụ tra cứu. Để trống số
            tiền = hoàn full giá vé.
          </Text>
          <TextInput
            label="Ticket ID"
            placeholder="24 ký tự hex"
            value={refundTicketId}
            onChange={(e) => setRefundTicketId(e.target.value)}
          />
          <NumberInput
            label="Số tiền hoàn (tuỳ chọn)"
            placeholder="Để trống = full giá vé"
            min={0}
            value={refundAmount === '' ? undefined : refundAmount}
            onChange={(v) => setRefundAmount(v ?? '')}
          />
          <TextInput
            label="Lý do (tuỳ chọn)"
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
          />
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setRefundOpen(false)}>
              Đóng
            </Button>
            <Button
              color="orange"
              loading={refund.isPending}
              onClick={submitRefund}
            >
              Hoàn vé
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
}
