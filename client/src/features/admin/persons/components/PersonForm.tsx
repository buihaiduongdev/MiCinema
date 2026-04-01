import {
  TextInput,
  Textarea,
  NumberInput,
  MultiSelect,
  Stack,
  Button,
  Group,
  Grid,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useEffect, useState } from 'react';
<<<<<<< HEAD
import {
  useCreatePerson,
  useUpdatePerson,
  usePersonById,
} from '../hooks';
=======
import { useCreatePerson, useUpdatePerson, usePersonById } from '../hooks';
>>>>>>> main
import { PERSON_ROLE } from '@shared/constants/person-roles';
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner';
import dayjs from '../../../../lib/dayjs';

interface PersonFormProps {
  personId?: string | null;
  onSuccess?: () => void;
}

export default function PersonForm({ personId, onSuccess }: PersonFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    avatar: '',
    images: [] as string[],
    nationality: '',
    biography: '',
    birthDate: null as Date | null,
    height: undefined as number | undefined,
    roles: [] as string[],
  });

  const { data: existingPerson, isLoading: isLoadingPerson } = usePersonById(
    personId || undefined,
  );
  const { mutate: createPerson, isPending: isCreating } = useCreatePerson();
  const { mutate: updatePerson, isPending: isUpdating } = useUpdatePerson();

  useEffect(() => {
    if (existingPerson) {
      setFormData({
        name: existingPerson.name || '',
        avatar: existingPerson.avatar || '',
        images: existingPerson.images || [],
        nationality: existingPerson.nationality || '',
        biography: existingPerson.biography || '',
        birthDate: existingPerson.birthDate
          ? new Date(existingPerson.birthDate)
          : null,
        height: existingPerson.height,
        roles: existingPerson.roles || [],
      });
    }
  }, [existingPerson]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      avatar: formData.avatar || undefined,
      images: formData.images,
      nationality: formData.nationality || undefined,
      biography: formData.biography || undefined,
      birthDate: formData.birthDate
        ? dayjs(formData.birthDate).toISOString()
        : undefined,
      height: formData.height,
      roles: formData.roles as ('ACTOR' | 'DIRECTOR')[],
    };

    if (personId) {
      updatePerson({ id: personId, data: payload }, { onSuccess });
    } else {
      createPerson(payload, { onSuccess });
    }
  };

  if (isLoadingPerson) {
    return <LoadingSpinner />;
  }

  const roleOptions = [
    { value: PERSON_ROLE.DIRECTOR, label: 'Đạo diễn' },
    { value: PERSON_ROLE.ACTOR, label: 'Diễn viên' },
  ];

  const inputStyles = {
    input: {
      backgroundColor: '#131b2e',
      border: '1px solid #424656',
      color: '#dae2fd',
      '&::placeholder': { color: '#8c90a1' },
    },
    label: { color: '#c2c6d8', fontWeight: 500 },
  };

  const selectStyles = {
    ...inputStyles,
    dropdown: {
      backgroundColor: '#131b2e',
      border: '1px solid #424656',
    },
    option: {
      color: '#dae2fd',
      '&[data-combobox-selected]': {
        backgroundColor: '#0066ff',
      },
      '&:hover': {
        backgroundColor: '#171f33',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <TextInput
          label="Tên"
          placeholder="Nhập tên đạo diễn/diễn viên"
          required
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.currentTarget.value })
          }
          styles={inputStyles}
        />

        <MultiSelect
          label="Vai trò"
          placeholder="Chọn vai trò"
          data={roleOptions}
          required
          value={formData.roles}
          onChange={(value) => setFormData({ ...formData, roles: value })}
          styles={selectStyles}
        />

        <TextInput
          label="Avatar URL"
          placeholder="https://example.com/avatar.jpg"
          value={formData.avatar}
          onChange={(e) =>
            setFormData({ ...formData, avatar: e.currentTarget.value })
          }
          styles={inputStyles}
        />

        <Grid>
          <Grid.Col span={6}>
            <TextInput
              label="Quốc tịch"
              placeholder="Việt Nam"
              value={formData.nationality}
              onChange={(e) =>
                setFormData({ ...formData, nationality: e.currentTarget.value })
              }
              styles={inputStyles}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <DateInput
              label="Ngày sinh"
              placeholder="DD/MM/YYYY"
              value={formData.birthDate}
              onChange={(value) =>
                setFormData({ ...formData, birthDate: value })
              }
              valueFormat="DD/MM/YYYY"
              clearable
              styles={inputStyles}
            />
          </Grid.Col>
        </Grid>

        <NumberInput
          label="Chiều cao (cm)"
          placeholder="170"
          min={50}
          max={250}
          value={formData.height}
          onChange={(value) =>
<<<<<<< HEAD
            setFormData({ ...formData, height: value ? Number(value) : undefined })
=======
            setFormData({
              ...formData,
              height: value ? Number(value) : undefined,
            })
>>>>>>> main
          }
          styles={inputStyles}
        />

        <Textarea
          label="Tiểu sử"
          placeholder="Nhập tiểu sử..."
          minRows={4}
          value={formData.biography}
          onChange={(e) =>
            setFormData({ ...formData, biography: e.currentTarget.value })
          }
          styles={inputStyles}
        />

        <Group justify="flex-end" mt="md">
          <Button
            type="submit"
            loading={isCreating || isUpdating}
            styles={{
              root: {
                background: '#0066ff',
                '&:hover': { background: '#0052cc' },
              },
            }}
          >
            {personId ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
