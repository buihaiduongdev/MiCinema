import { Badge, Image, ActionIcon, Text, Avatar } from '@mantine/core';
import { Pencil, Trash2 } from 'lucide-react';
import type { Person } from '../hooks';

interface PersonTableProps {
  persons: Person[];
  onEdit: (person: Person) => void;
  onDelete: (person: Person) => void;
}

const ROLE_LABELS: Record<string, string> = {
  ACTOR: 'Diễn viên',
  DIRECTOR: 'Đạo diễn',
};

const ROLE_COLORS: Record<string, string> = {
  ACTOR: 'green',
  DIRECTOR: 'blue',
};

export default function PersonTable({
  persons,
  onEdit,
  onDelete,
}: PersonTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-[#060e20] text-[#8c90a1] text-xs uppercase tracking-wider">
            <th className="px-4 py-3 text-left font-bold">Ảnh</th>
            <th className="px-4 py-3 text-left font-bold">Tên</th>
            <th className="px-4 py-3 text-left font-bold">Vai trò</th>
            <th className="px-4 py-3 text-left font-bold">Quốc tịch</th>
            <th className="px-4 py-3 text-left font-bold">Ngày sinh</th>
            <th className="px-4 py-3 text-left font-bold">Lượt xem</th>
            <th className="px-4 py-3 text-left font-bold">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {persons.map((person, index) => (
            <tr
              key={person._id}
              className={`border-b border-[#424656]/30 hover:bg-[#171f33] transition-colors ${
                index % 2 === 0 ? 'bg-[#131b2e]' : 'bg-[#0f1623]'
              }`}
            >
              <td className="px-4 py-3">
                <Avatar
                  src={person.avatar}
                  alt={person.name}
                  size="lg"
                  radius="xl"
                >
                  {person.name?.charAt(0)}
                </Avatar>
              </td>
              <td className="px-4 py-3">
                <Text fw={500} c="#dae2fd">
                  {person.name}
                </Text>
                {person.height && (
                  <Text size="xs" c="#8c90a1">
                    {person.height} cm
                  </Text>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-1 flex-wrap">
                  {person.roles.map((role) => (
                    <Badge
                      key={role}
                      size="sm"
                      color={ROLE_COLORS[role]}
                      variant="filled"
                    >
                      {ROLE_LABELS[role]}
                    </Badge>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3 text-[#dae2fd]">
                {person.nationality || '-'}
              </td>
              <td className="px-4 py-3 text-[#dae2fd]">
                {person.birthDate
                  ? new Date(person.birthDate).toLocaleDateString('vi-VN')
                  : '-'}
              </td>
              <td className="px-4 py-3 text-[#dae2fd]">
                {person.viewCount.toLocaleString()}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <ActionIcon
                    variant="light"
                    color="blue"
                    onClick={() => onEdit(person)}
                  >
                    <Pencil size={16} />
                  </ActionIcon>
                  <ActionIcon
                    variant="light"
                    color="red"
                    onClick={() => onDelete(person)}
                  >
                    <Trash2 size={16} />
                  </ActionIcon>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
