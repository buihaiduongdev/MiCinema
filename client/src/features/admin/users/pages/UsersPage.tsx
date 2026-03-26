import { useMemo, useState } from 'react';
import { Button, Select, TextInput, Tooltip } from '@mantine/core';
import { Modal } from '../../../../components/ui/Modal';
import { ConfirmDialog } from '../../../../components/ui/ConfirmDialog';
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner';
import { EmptyState } from '../../../../components/ui/EmptyState';
import UserForm from '../components/UserForm';
import { useUsers, useLockUser, useUnlockUser } from '../hooks/useUsers';
import { useDebounce } from '../../../../hooks/useDebounce';
import { ROLES } from '@shared/constants/roles';
import {
  Pencil,
  Lock,
  Unlock,
  Plus,
  Search,
  Home,
  ChevronRight,
  Filter,
} from 'lucide-react';

/**
 * UsersPage — Trang quản lý user (UC-30, UC-31, UC-32)
 * Danh sách user, tìm kiếm, filter role, khoá/mở khoá
 */

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 500);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isActiveFilter, setIsActiveFilter] = useState<string | null>(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [lockConfirmId, setLockConfirmId] = useState<string | null>(null);
  const [unlockConfirmId, setUnlockConfirmId] = useState<string | null>(null);

  const { data: usersResponse, isLoading } = useUsers({
    page,
    limit: 10,
    search: debouncedSearch,
    role: selectedRole || undefined,
    isActive: isActiveFilter ? isActiveFilter === 'true' : undefined,
  });

  const usersData = usersResponse?.data?.data;
  const totalUsers =
    Number((usersResponse?.data as unknown as { total?: number } | undefined)?.total) ||
    0;
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(totalUsers / pageSize));
  const { mutate: lockUser, isPending: isLocking } = useLockUser();
  const { mutate: unlockUser, isPending: isUnlocking } = useUnlockUser();

  const handleLockUser = (userId: string) => {
    lockUser(userId, {
      onSuccess: () => {
        setLockConfirmId(null);
      },
    });
  };

  const handleUnlockUser = (userId: string) => {
    unlockUser(userId, {
      onSuccess: () => {
        setUnlockConfirmId(null);
      },
    });
  };

  const getRowId = (row: unknown) => {
    const r = row as Record<string, unknown> | null;
    if (!r) return undefined;
    return (r.id as string | undefined) || (r._id as string | undefined);
  };

  const roleOptions = useMemo(
    () => [
      { value: 'ALL', label: 'Tất cả' },
      { value: ROLES.ADMIN, label: 'Tất cả' },
      { value: ROLES.STAFF, label: 'Nhân viên' },
      { value: ROLES.CUSTOMER, label: 'Khách hàng' },
    ],
    []
  );

  const getRoleLabel = (role: string): string => {
    switch (role) {
      case ROLES.ADMIN:
        return 'Quản trị viên';
      case ROLES.STAFF:
        return 'Nhân viên';
      case ROLES.CUSTOMER:
        return 'Khách hàng';
      default:
        return role;
    }
  };

  const getStatusLabel = (isActive: boolean): string => {
    return isActive ? 'Hoạt động' : 'Bị khoá';
  };

  const activeRole = selectedRole || 'ALL';

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="w-full min-w-0">
      <div className="max-w-screen-2xl mx-auto">
        {/* Breadcrumbs & Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-6 mb-8">
          <div className="min-w-0">
            <h1 className="text-4xl font-extrabold tracking-tight text-[#dae2fd] mb-2">
              Quản lý tài khoản
            </h1>
            <p className="text-[#c2c6d8] flex items-center gap-2 text-sm">
              <Home size={14} />
              <span>Hệ thống</span>
              <ChevronRight size={14} />
              <span className="text-[#b3c5ff]">Tài khoản người dùng</span>
            </p>
          </div>

          <Button
            onClick={() => setOpenCreateModal(true)}
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
            Tạo tài khoản nhân viên
          </Button>
        </div>

        {/* Bento Filter Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mb-8">
          <div className="lg:col-span-1 bg-[#131b2e] p-7 rounded-xl flex flex-col justify-center">
            <span className="text-[#8c90a1] text-xs uppercase font-bold tracking-widest mb-1">
              Tổng người dùng
            </span>
            <span className="text-4xl font-extrabold text-[#b3c5ff]">
              {totalUsers.toLocaleString('vi-VN')}
            </span>
          </div>

          <div className="lg:col-span-3 bg-[#131b2e] p-7 rounded-xl">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#8c90a1]">Vai trò</label>
                <div className="flex gap-2 flex-wrap">
                  {roleOptions.map((r) => {
                    const isActive = activeRole === r.value;
                    return (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => {
                          setSelectedRole(r.value === 'ALL' ? null : r.value);
                          setPage(1);
                        }}
                        className={
                          isActive
                            ? 'px-4 py-2 rounded-lg bg-[#2d3449] text-[#b3c5ff] text-sm font-bold border border-[#b3c5ff]/20'
                            : 'px-4 py-2 rounded-lg bg-[#060e20] text-[#c2c6d8] text-sm hover:bg-[#2d3449] transition-colors'
                        }
                      >
                        {r.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="h-12 w-[1px] bg-[#424656]/20 mx-2 hidden lg:block"></div>

              <div className="flex flex-col gap-2 flex-1 min-w-[220px]">
                <label className="text-xs font-bold text-[#8c90a1]">Trạng thái</label>
                <Select
                  placeholder="Tất cả trạng thái"
                  data={[
                    { value: '', label: 'Tất cả trạng thái' },
                    { value: 'true', label: 'Hoạt động' },
                    { value: 'false', label: 'Bị khoá' },
                  ]}
                  value={isActiveFilter || ''}
                  onChange={(v) => {
                    setIsActiveFilter(v || null);
                    setPage(1);
                  }}
                  styles={{
                    input: {
                      background: '#060e20',
                      border: 'none',
                      borderRadius: 10,
                      color: '#dae2fd',
                    },
                    dropdown: { background: '#171f33', borderColor: '#424656' },
                    option: { color: '#dae2fd' },
                  }}
                />
              </div>

              <div className="flex flex-col gap-2 flex-1 min-w-[240px]">
                <label className="text-xs font-bold text-[#8c90a1]">Tìm kiếm</label>
                <TextInput
                  placeholder="Tìm kiếm tài khoản, email..."
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.currentTarget.value);
                  }}
                  leftSection={<Search size={16} />}
                  styles={{
                    input: {
                      background: '#060e20',
                      border: 'none',
                      borderRadius: 999,
                      color: '#dae2fd',
                    },
                    section: { color: '#8c90a1' },
                  }}
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  setSelectedRole(null);
                  setIsActiveFilter(null);
                  setPage(1);
                }}
                className="mt-auto mb-1 p-2 text-[#8c90a1] hover:text-[#dae2fd]"
                title="Xoá bộ lọc"
              >
                <Filter size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Table Section */}
        {usersData && Array.isArray(usersData) && usersData.length > 0 ? (
          <div className="bg-[#171f33] rounded-2xl overflow-hidden shadow-2xl w-full min-w-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#222a3d]">
                  <tr>
                    <th className="px-8 py-4 text-xs font-bold text-[#8c90a1] uppercase tracking-wider">
                      Họ tên &amp; Email
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-[#8c90a1] uppercase tracking-wider">
                      Vai trò
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-[#8c90a1] uppercase tracking-wider">
                      Số điện thoại
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-[#8c90a1] uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-9 py-4 text-xs font-bold text-[#8c90a1] uppercase tracking-wider text-right">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#424656]/10">
                  {usersData.map((row: unknown) => {
                    const userId = getRowId(row);
                    const r = row as Record<string, unknown>;
                    const fullName = (r.fullName as string | undefined) || '';
                    const email = (r.email as string | undefined) || '';
                    const phone = (r.phone as string | undefined) || '';
                    const role = (r.role as string | undefined) || '';
                    const isActive = Boolean(r.isActive);

                    const initials = ((fullName as string) || email || 'U')
                      .split(' ')
                      .slice(0, 2)
                      .map((s: string) => s.charAt(0))
                      .join('')
                      .toUpperCase();

                    const rolePillClass =
                      role === ROLES.ADMIN
                        ? 'bg-[#0066ff]/15 text-[#b3c5ff] border border-[#b3c5ff]/20'
                        : role === ROLES.STAFF
                          ? 'bg-[#284386]/40 text-[#b3c5ff] border border-[#b3c5ff]/20'
                          : 'bg-[#2d3449] text-[#c2c6d8]';

                    return (
                      <tr
                        key={userId || email}
                        className="hover:bg-[#2d3449] transition-colors group"
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#b3c5ff]/10 flex items-center justify-center text-[#b3c5ff] font-bold">
                              {initials}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-[#dae2fd]">
                                {fullName || '—'}
                              </span>
                              <span className="text-xs text-[#8c90a1]">
                                {email}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-extrabold ${rolePillClass}`}
                          >
                            {getRoleLabel(role)}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-[#c2c6d8] text-sm font-medium">
                          {phone || '—'}
                        </td>

                        <td className="px-6 py-5">
                          {isActive ? (
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                              <span className="text-xs font-bold text-[#dae2fd]">
                                {getStatusLabel(isActive)}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-[#ffb4ac] shadow-[0_0_8px_rgba(255,180,172,0.6)]"></div>
                              <span className="text-xs font-bold text-[#ffb4ac]">
                                {getStatusLabel(isActive)}
                              </span>
                            </div>
                          )}
                        </td>

                        <td className="px-9 py-5 text-right">
                          <div className="flex items-center justify-end gap-2 pr-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Tooltip label="Sửa thông tin">
                              <button
                                type="button"
                                onClick={() => userId && setEditingUserId(userId)}
                                className="p-2 rounded-lg bg-[#060e20] text-[#c2c6d8] hover:text-[#b3c5ff] transition-colors"
                                disabled={!userId}
                              >
                                <Pencil size={16} />
                              </button>
                            </Tooltip>

                            {isActive ? (
                              <Tooltip label="Khoá tài khoản">
                                <button
                                  type="button"
                                  onClick={() => userId && setLockConfirmId(userId)}
                                  className="p-2 rounded-lg bg-[#060e20] text-[#c2c6d8] hover:text-[#ffb4ac] transition-colors"
                                  disabled={!userId}
                                >
                                  <Lock size={16} />
                                </button>
                              </Tooltip>
                            ) : (
                              <Tooltip label="Mở khoá tài khoản">
                                <button
                                  type="button"
                                  onClick={() => userId && setUnlockConfirmId(userId)}
                                  className="p-2 rounded-lg bg-[#060e20] text-green-500 hover:text-green-400 transition-colors"
                                  disabled={!userId}
                                >
                                  <Unlock size={16} />
                                </button>
                              </Tooltip>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 flex items-center justify-between border-t border-[#424656]/10 gap-4 flex-wrap">
              <span className="text-xs text-[#8c90a1] font-medium">
                Hiển thị {(page - 1) * pageSize + 1} -{' '}
                {Math.min(page * pageSize, totalUsers)} trong tổng số{' '}
                {totalUsers.toLocaleString('vi-VN')} người dùng
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-2 rounded-lg bg-[#060e20] text-[#8c90a1] hover:text-[#dae2fd] disabled:opacity-50"
                  disabled={page <= 1}
                  title="Trang trước"
                >
                  <ChevronRight size={16} className="rotate-180" />
                </button>

                {Array.from({ length: Math.min(3, totalPages) }).map((_, i) => {
                  const n = i + 1;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setPage(n)}
                      className={
                        n === page
                          ? 'w-8 h-8 rounded-lg bg-[#b3c5ff] text-[#002b75] text-xs font-bold'
                          : 'w-8 h-8 rounded-lg hover:bg-[#2d3449] text-[#c2c6d8] text-xs font-bold'
                      }
                    >
                      {n}
                    </button>
                  );
                })}

                {totalPages > 4 && <span className="text-[#8c90a1] mx-1">...</span>}

                {totalPages > 3 && (
                  <button
                    type="button"
                    onClick={() => setPage(totalPages)}
                    className={
                      page === totalPages
                        ? 'w-8 h-8 rounded-lg bg-[#b3c5ff] text-[#002b75] text-xs font-bold'
                        : 'w-8 h-8 rounded-lg hover:bg-[#2d3449] text-[#c2c6d8] text-xs font-bold'
                    }
                  >
                    {totalPages}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="p-2 rounded-lg bg-[#060e20] text-[#8c90a1] hover:text-[#dae2fd] disabled:opacity-50"
                  disabled={page >= totalPages}
                  title="Trang sau"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState
            title="Không có tài khoản"
            description="Hãy tạo tài khoản mới hoặc thay đổi bộ lọc"
          />
        )}

        {/* Create/Edit User Modal */}
        <Modal
          opened={openCreateModal || !!editingUserId}
          onClose={() => {
            setOpenCreateModal(false);
            setEditingUserId(null);
          }}
          title={
            editingUserId ? 'Chỉnh sửa tài khoản' : 'Tạo tài khoản nhân viên'
          }
        >
          <UserForm
            userId={editingUserId}
            onSuccess={() => {
              setOpenCreateModal(false);
              setEditingUserId(null);
            }}
          />
        </Modal>

        {/* Lock Confirmation */}
        <ConfirmDialog
          opened={!!lockConfirmId}
          title="Khoá tài khoản?"
          message="Tài khoản này sẽ không thể đăng nhập cho đến khi được mở khoá"
          onConfirm={() => {
            if (lockConfirmId) handleLockUser(lockConfirmId);
          }}
          onClose={() => setLockConfirmId(null)}
          loading={isLocking}
          confirmText="Khoá"
          cancelText="Huỷ"
          danger={true}
        />

        {/* Unlock Confirmation */}
        <ConfirmDialog
          opened={!!unlockConfirmId}
          title="Mở khoá tài khoản?"
          message="Tài khoản này sẽ có thể đăng nhập lại"
          onConfirm={() => {
            if (unlockConfirmId) handleUnlockUser(unlockConfirmId);
          }}
          onClose={() => setUnlockConfirmId(null)}
          loading={isUnlocking}
          confirmText="Mở khoá"
          cancelText="Huỷ"
        />
      </div>
    </div>
  );
}
