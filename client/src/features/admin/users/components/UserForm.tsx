import {
  TextInput,
  PasswordInput,
  Select,
  Stack,
  Button,
  Group,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useCreateUser, useUpdateUser, useUserById } from '../hooks/useUsers';
import { ROLES } from '@shared/constants/roles';
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner';

interface UserFormProps {
  userId?: string | null;
  onSuccess?: () => void;
}

/**
 * UserForm — Form tạo/chỉnh sửa user (UC-31)
 */

export default function UserForm({ userId, onSuccess }: UserFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    role: 'STAFF' as string,
  });

  const { data: existingUser, isLoading: isLoadingUser } = useUserById(
    userId || undefined,
  );
  const { mutate: createUser, isPending: isCreating } = useCreateUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();

  // Populate form khi load user hiện tại
  useEffect(() => {
    if (existingUser?.data) {
      setFormData({
        email: existingUser.data.email || '',
        password: '',
        fullName: existingUser.data.fullName || '',
        phone: existingUser.data.phone || '',
        role: existingUser.data.role || 'STAFF',
      });
    }
  }, [existingUser?.data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (userId) {
      // Update user
      updateUser(
        {
          id: userId,
          data: {
            fullName: formData.fullName,
            phone: formData.phone,
            role: formData.role as any,
            ...(formData.password ? { password: formData.password } : {}),
          },
        },
        {
          onSuccess,
        },
      );
    } else {
      // Create new user
      createUser(formData, {
        onSuccess,
      });
    }
  };

  if (isLoadingUser) return <LoadingSpinner />;

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        {/* Email */}
        <TextInput
          label="Email"
          placeholder="email@example.com"
          type="email"
          disabled={!!userId}
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        {/* Password */}
        <PasswordInput
          label={userId ? 'Mật khẩu (để trống nếu không thay đổi)' : 'Mật khẩu'}
          placeholder="••••••••"
          required={!userId}
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        {/* Full Name */}
        <TextInput
          label="Họ tên"
          placeholder="Nguyễn Văn A"
          required
          value={formData.fullName}
          onChange={(e) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
        />

        {/* Phone */}
        <TextInput
          label="Số điện thoại"
          placeholder="0123456789"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />

        {/* Role */}
        <Select
          label="Vai trò"
          placeholder="Chọn vai trò"
          data={[
            { value: ROLES.STAFF, label: 'Nhân viên' },
            { value: ROLES.CUSTOMER, label: 'Khách hàng' },
          ]}
          value={formData.role}
          onChange={(val) =>
            setFormData({ ...formData, role: (val as string) || ROLES.STAFF })
          }
        />

        {/* Buttons */}
        <Group justify="flex-end" gap="sm" className="pt-4">
          <Button variant="light" type="button">
            Hủy
          </Button>
          <Button
            loading={isCreating || isUpdating}
            type="submit"
            className="bg-blue-600 hover:bg-blue-700"
          >
            {userId ? 'Cập nhật' : 'Tạo tài khoản'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
