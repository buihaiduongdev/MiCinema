import { useState } from 'react';
import { Button, Select, TextInput, Badge, Tooltip } from '@mantine/core';
import { DataTable, type DataTableColumn } from '../../../../components/ui/DataTable';
import { Modal } from '../../../../components/ui/Modal';
import { ConfirmDialog } from '../../../../components/ui/ConfirmDialog';
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner';
import { EmptyState } from '../../../../components/ui/EmptyState';
import UserForm from '../components/UserForm';
import { useUsers, useLockUser, useUnlockUser } from '../hooks/useUsers';
import { ROLES } from '@shared/constants/roles';
import { Pencil, Lock, Unlock, Plus, Search } from 'lucide-react';

/**
 * UsersPage — Trang quản lý user (UC-30, UC-31, UC-32)
 * Danh sách user, tìm kiếm, filter role, khoá/mở khoá
 */

export default function UsersPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [isActiveFilter, setIsActiveFilter] = useState<string | null>(null);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [lockConfirmId, setLockConfirmId] = useState<string | null>(null);
    const [unlockConfirmId, setUnlockConfirmId] = useState<string | null>(null);

    const { data: usersResponse, isLoading } = useUsers({
        page,
        limit: 10,
        search,
        role: selectedRole || undefined,
        isActive: isActiveFilter ? isActiveFilter === 'true' : undefined,
    });

    const usersData = usersResponse?.data?.data;
    const totalUsers = (usersResponse?.data as any)?.total || 0;
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

    const columns: DataTableColumn[] = [
        {
            key: 'email',
            header: 'Email',
            width: '25%',
        },
        {
            key: 'fullName',
            header: 'Họ tên',
            width: '20%',
        },
        {
            key: 'role',
            header: 'Vai trò',
            width: '15%',
            render: (row) => (
                <Badge
                    variant="dot"
                    color={
                        row.role === ROLES.ADMIN
                            ? 'red'
                            : row.role === ROLES.STAFF
                                ? 'blue'
                                : 'gray'
                    }
                >
                    {row.role === ROLES.ADMIN
                        ? 'Quản trị viên'
                        : row.role === ROLES.STAFF
                            ? 'Nhân viên'
                            : 'Khách hàng'}
                </Badge>
            ),
        },
        {
            key: 'phone',
            header: 'Số điện thoại',
            width: '15%',
        },
        {
            key: 'isActive',
            header: 'Trạng thái',
            width: '12%',
            render: (row) => (
                <Badge
                    variant="dot"
                    color={row.isActive ? 'green' : 'red'}
                >
                    {row.isActive ? 'Hoạt động' : 'Bị khoá'}
                </Badge>
            ),
        },
        {
            key: 'actions',
            header: 'Hành động',
            width: '15%',
            align: 'center',
            render: (row: any) => (
                <div className="flex gap-2 justify-center">
                    <Tooltip label="Chỉnh sửa">
                        <button
                            onClick={() => setEditingUserId(row.id)}
                            className="p-2 hover:bg-gray-200 rounded"
                        >
                            <Pencil size={18} />
                        </button>
                    </Tooltip>
                    {row.isActive ? (
                        <Tooltip label="Khoá tài khoản">
                            <button
                                onClick={() => setLockConfirmId(row.id)}
                                className="p-2 hover:bg-red-100 rounded"
                            >
                                <Lock size={18} className="text-red-600" />
                            </button>
                        </Tooltip>
                    ) : (
                        <Tooltip label="Mở khoá tài khoản">
                            <button
                                onClick={() => setUnlockConfirmId(row.id)}
                                className="p-2 hover:bg-green-100 rounded"
                            >
                                <Unlock size={18} className="text-green-600" />
                            </button>
                        </Tooltip>
                    )}
                </div>
            ),
        },
    ];

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Quản lý tài khoản</h1>
                    <Button
                        onClick={() => setOpenCreateModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Tạo tài khoản
                    </Button>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                            <TextInput
                                placeholder="Tìm kiếm email, tên..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.currentTarget.value);
                                    setPage(1);
                                }}
                                className="pl-10"
                            />
                        </div>

                        <Select
                            placeholder="Lọc theo vai trò"
                            data={[
                                { value: '', label: 'Tất cả' },
                                { value: ROLES.ADMIN, label: 'Quản trị viên' },
                                { value: ROLES.STAFF, label: 'Nhân viên' },
                                { value: ROLES.CUSTOMER, label: 'Khách hàng' },
                            ]}
                            value={selectedRole}
                            onChange={setSelectedRole}
                        />

                        <Select
                            placeholder="Lọc theo trạng thái"
                            data={[
                                { value: '', label: 'Tất cả' },
                                { value: 'true', label: 'Hoạt động' },
                                { value: 'false', label: 'Bị khoá' },
                            ]}
                            value={isActiveFilter}
                            onChange={setIsActiveFilter}
                        />

                        <Button
                            variant="light"
                            onClick={() => {
                                setSearch('');
                                setSelectedRole(null);
                                setIsActiveFilter(null);
                                setPage(1);
                            }}
                        >
                            Xóa bộ lọc
                        </Button>
                    </div>
                </div>

                {/* Table */}
                {usersData && Array.isArray(usersData) && usersData.length > 0 ? (
                    <div className="bg-white rounded-lg shadow">
                        <DataTable
                            columns={columns}
                            data={usersData}
                            rowKey="id"
                            pagination={{
                                page,
                                total: totalUsers,
                                onChange: setPage,
                            }}
                            loading={isLoading}
                        />
                    </div>
                ) : (
                    <EmptyState
                        title="Không có tài khoản"
                        description="Hãy tạo tài khoản mới hoặc thay đổi bộ lọc"
                    />
                )}
            </div>

            {/* Create/Edit User Modal */}
            <Modal
                opened={openCreateModal || !!editingUserId}
                onClose={() => {
                    setOpenCreateModal(false);
                    setEditingUserId(null);
                }}
                title={editingUserId ? 'Chỉnh sửa tài khoản' : 'Tạo tài khoản nhân viên'}
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
    );
}
