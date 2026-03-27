import { Modal, Text, Button, Group } from '@mantine/core';
import { useDeletePerson, type Person } from '../hooks';

interface DeletePersonDialogProps {
  person: Person | null;
  opened: boolean;
  onClose: () => void;
}

export default function DeletePersonDialog({
  person,
  opened,
  onClose,
}: DeletePersonDialogProps) {
  const { mutate: deletePerson, isPending } = useDeletePerson();

  const handleDelete = () => {
    if (person) {
      deletePerson(person._id, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Xác nhận xóa"
      centered
      styles={{
        content: { backgroundColor: '#131b2e' },
        header: { backgroundColor: '#131b2e', color: '#dae2fd' },
        title: { fontWeight: 'bold' },
      }}
    >
      <Text c="#c2c6d8" mb="lg">
        Bạn có chắc chắn muốn xóa <strong>{person?.name}</strong>? Hành động này
        không thể hoàn tác.
      </Text>
      <Group justify="flex-end">
        <Button variant="subtle" onClick={onClose} c="#8c90a1">
          Hủy
        </Button>
        <Button color="red" onClick={handleDelete} loading={isPending}>
          Xóa
        </Button>
      </Group>
    </Modal>
  );
}
