/**
 * ManageShowtimesPage — Trang quản lý lịch chiếu (Admin)
 *
 * UC-21: Tạo suất chiếu
 * UC-22: Sửa suất chiếu (chỉ khi chưa có ai đặt)
 * UC-23: Huỷ suất chiếu + tự động hoàn vé
 *
 * Compose: Filter bar + Table + ShowtimeForm (Modal)
 */

import { useState } from 'react';
import { Button, Select, TextInput, Modal, Badge } from '@mantine/core';
import {
  Plus,
  Home,
  ChevronRight,
  Edit,
  Trash2,
  Calendar,
  Clock,
  Film,
  MapPin,
} from 'lucide-react';
import ShowtimeForm from '../components/ShowtimeForm';
import { useShowtimes, useCancelShowtime } from '../hooks/useShowtimeCRUD';
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner';
import { useDebounce } from '../../../../hooks/useDebounce';

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  OPEN: { label: 'Đang mở', color: 'green' },
  FINISHED: { label: 'Đã chiếu', color: 'gray' },
  CANCELLED: { label: 'Đã huỷ', color: 'red' },
};

export default function ManageShowtimesPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState('');
  const debouncedDate = useDebounce(dateFilter, 300);

  const [openFormModal, setOpenFormModal] = useState(false);
  const [editingShowtime, setEditingShowtime] = useState<any | null>(null);
  const [cancelConfirmId, setCancelConfirmId] = useState<string | null>(null);

  const params: any = {
    page,
    limit: 15,
    sortBy: 'startTime',
    sortOrder: 'desc',
  };
  if (statusFilter) params.status = statusFilter;
  if (debouncedDate) params.date = debouncedDate;

  const { data: rawData, isLoading } = useShowtimes(params);
  const cancelMutation = useCancelShowtime();

  const showtimes: any[] = (rawData as any)?.data?.data || [];
  const pagination = (rawData as any)?.data?.pagination;
  const totalPages = pagination
    ? Math.ceil(pagination.totalItems / (pagination.itemsPerPage || 15))
    : 1;

  const handleEdit = (showtime: any) => {
    setEditingShowtime(showtime);
    setOpenFormModal(true);
  };

  const handleCloseForm = () => {
    setOpenFormModal(false);
    setEditingShowtime(null);
  };

  const handleCancel = () => {
    if (!cancelConfirmId) return;
    cancelMutation.mutate(cancelConfirmId, {
      onSuccess: () => setCancelConfirmId(null),
    });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="w-full min-w-0">
      <div className="max-w-screen-2xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-6 mb-8">
          <div className="min-w-0">
            <h1 className="text-4xl font-extrabold tracking-tight text-[#dae2fd] mb-2">
              Quản lý lịch chiếu
            </h1>
            <p className="text-[#c2c6d8] flex items-center gap-2 text-sm">
              <Home size={14} />
              <span>Hệ thống</span>
              <ChevronRight size={14} />
              <span className="text-[#b3c5ff]">Lịch chiếu</span>
            </p>
          </div>

          <Button
            onClick={() => setOpenFormModal(true)}
            leftSection={<Plus size={18} />}
            styles={{
              root: {
                background: '#0066ff',
                color: '#f8f7ff',
                borderRadius: 14,
                paddingInline: 18,
                height: 44,
                fontWeight: 800,
                boxShadow: '0 12px 24px rgba(0,102,255,0.22)',
              },
            }}
          >
            Tạo suất chiếu
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-[#131b2e] p-6 rounded-xl mb-6">
          <div className="flex gap-4 flex-wrap">
            <TextInput
              placeholder="Lọc theo ngày (YYYY-MM-DD)"
              leftSection={<Calendar size={16} />}
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.currentTarget.value)}
              styles={{
                input: {
                  backgroundColor: '#060e20',
                  border: 'none',
                  color: '#dae2fd',
                  minWidth: '200px',
                },
              }}
            />
            <Select
              placeholder="Trạng thái"
              clearable
              data={[
                { value: 'OPEN', label: 'Đang mở' },
                { value: 'FINISHED', label: 'Đã chiếu' },
                { value: 'CANCELLED', label: 'Đã huỷ' },
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
              styles={{
                input: {
                  backgroundColor: '#060e20',
                  border: 'none',
                  color: '#dae2fd',
                  minWidth: '150px',
                },
              }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#131b2e] rounded-xl overflow-hidden">
          {showtimes.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar size={48} className="mx-auto mb-4 text-[#424656]" />
              <p className="text-[#8c90a1]">Không tìm thấy suất chiếu nào</p>
            </div>
          ) : (
            <>
              {/* Table header */}
              <div className="hidden lg:grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_120px] gap-4 px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#8c90a1] border-b border-[#424656]/30">
                <span className="flex items-center gap-1">
                  <Film size={12} /> Phim
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={12} /> Rạp / Phòng
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} /> Giờ chiếu
                </span>
                <span>Giá vé</span>
                <span>Trạng thái</span>
                <span className="text-center">Thao tác</span>
              </div>

              {/* Table body */}
              {showtimes.map((st: any) => {
                const movie = st.movieId || {};
                const cinema = st.cinemaId || {};
                const room = st.roomId || {};
                const status = STATUS_MAP[st.status] || STATUS_MAP.OPEN;

                return (
                  <div
                    key={st._id}
                    className="grid grid-cols-1 lg:grid-cols-[2fr_1.5fr_1fr_1fr_1fr_120px] gap-4 px-6 py-4 items-center border-b border-[#424656]/15 hover:bg-[#1a2440] transition"
                  >
                    {/* Phim */}
                    <div className="min-w-0">
                      <p className="font-bold text-[#dae2fd] truncate">
                        {movie.title || 'N/A'}
                      </p>
                      <p className="text-xs text-[#8c90a1] mt-0.5">
                        {movie.duration ? `${movie.duration} phút` : ''}{' '}
                        {movie.ageRating ? `· ${movie.ageRating}` : ''}
                      </p>
                    </div>

                    {/* Rạp / Phòng */}
                    <div className="min-w-0">
                      <p className="text-sm text-[#c2c6d8] truncate">
                        {cinema.name || 'N/A'}
                      </p>
                      <p className="text-xs text-[#8c90a1]">
                        {room.name || 'N/A'}
                      </p>
                    </div>

                    {/* Giờ chiếu */}
                    <div>
                      <p className="text-sm text-[#dae2fd] font-semibold">
                        {new Date(st.startTime).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <p className="text-xs text-[#8c90a1]">
                        {new Date(st.startTime).toLocaleDateString('vi-VN')}
                      </p>
                    </div>

                    {/* Giá vé */}
                    <p className="text-sm font-semibold text-[#b3c5ff]">
                      {st.ticketPrice?.toLocaleString('vi-VN')}đ
                    </p>

                    {/* Trạng thái */}
                    <Badge
                      color={status.color}
                      variant="light"
                      size="sm"
                      styles={{
                        root: { textTransform: 'none', fontWeight: 700 },
                      }}
                    >
                      {status.label}
                    </Badge>

                    {/* Thao tác */}
                    <div className="flex gap-2 justify-center">
                      {st.status === 'OPEN' && (
                        <>
                          <button
                            onClick={() => handleEdit(st)}
                            className="p-2 rounded-lg bg-[#0066ff]/15 text-[#4d9aff] hover:bg-[#0066ff]/25 transition"
                            title="Sửa suất chiếu"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => setCancelConfirmId(st._id)}
                            className="p-2 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 transition"
                            title="Huỷ suất chiếu"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                      {st.status !== 'OPEN' && (
                        <span className="text-xs text-[#8c90a1] italic">—</span>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 flex justify-center border-t border-[#424656]/30">
                  <div className="flex gap-2">
                    {Array.from(
                      { length: Math.min(totalPages, 10) },
                      (_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setPage(i + 1)}
                          className={`px-4 py-2 rounded-lg transition-all ${
                            page === i + 1
                              ? 'bg-[#0066ff] text-white font-bold'
                              : 'bg-[#060e20] text-[#8c90a1] hover:text-[#dae2fd]'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Form Modal */}
      <Modal
        opened={openFormModal}
        onClose={handleCloseForm}
        title={editingShowtime ? 'Sửa suất chiếu' : 'Tạo suất chiếu mới'}
        size="lg"
        styles={{
          content: { backgroundColor: '#131b2e' },
          header: { backgroundColor: '#131b2e', color: '#dae2fd' },
          title: { fontWeight: 'bold', fontSize: '1.25rem' },
        }}
      >
        <ShowtimeForm
          initialData={editingShowtime}
          onSuccess={handleCloseForm}
        />
      </Modal>

      {/* Cancel Confirm Modal */}
      <Modal
        opened={!!cancelConfirmId}
        onClose={() => setCancelConfirmId(null)}
        title="Xác nhận huỷ suất chiếu"
        size="sm"
        centered
        styles={{
          content: { backgroundColor: '#131b2e' },
          header: { backgroundColor: '#131b2e', color: '#dae2fd' },
          title: { fontWeight: 'bold', fontSize: '1.1rem' },
        }}
      >
        <div className="space-y-4">
          <p className="text-[#c2c6d8] text-sm">
            Bạn có chắc chắn muốn huỷ suất chiếu này không?
          </p>
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-red-300 text-xs font-semibold">
              ⚠️ Tất cả vé đã đặt sẽ được tự động hoàn trả cho khách hàng.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="subtle"
              color="gray"
              onClick={() => setCancelConfirmId(null)}
            >
              Không
            </Button>
            <Button
              color="red"
              loading={cancelMutation.isPending}
              onClick={handleCancel}
            >
              Xác nhận huỷ
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
