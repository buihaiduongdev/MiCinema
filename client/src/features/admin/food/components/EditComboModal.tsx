import { Modal } from '@mantine/core';
import { ComboForm } from './ComboForm';
import { useProductById } from '../hooks/useFoodCRUD';

type Props = {
  comboId: string | null;
  opened: boolean;
  onClose: () => void;
  retailOptions: { value: string; label: string }[];
};

export function EditComboModal({
  comboId,
  opened,
  onClose,
  retailOptions,
}: Props) {
  const { data: detail, isLoading } = useProductById(
    comboId ?? undefined,
    opened && !!comboId,
  );

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Sửa combo"
      size="lg"
      styles={{
        content: { backgroundColor: '#131b2e' },
        header: { backgroundColor: '#131b2e', color: '#dae2fd' },
        title: { fontWeight: 'bold', fontSize: '1.25rem' },
        body: { maxHeight: '80vh', overflowY: 'auto' },
      }}
    >
      {isLoading || !comboId ? (
        <p className="text-[#8c90a1]">Đang tải...</p>
      ) : (
        <ComboForm
          comboId={comboId}
          detail={detail ?? null}
          retailOptions={retailOptions}
          onSuccess={onClose}
        />
      )}
    </Modal>
  );
}
