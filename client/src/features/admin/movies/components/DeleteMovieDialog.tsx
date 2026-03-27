import { Modal, Text, Group, Button, Alert } from '@mantine/core';
import { AlertTriangle } from 'lucide-react';
import { useDeleteMovie } from '../hooks';
import type { Movie } from '../hooks';

interface DeleteMovieDialogProps {
  movie: Movie | null;
  opened: boolean;
  onClose: () => void;
}

export default function DeleteMovieDialog({
  movie,
  opened,
  onClose,
}: DeleteMovieDialogProps) {
  const { mutate: deleteMovie, isPending } = useDeleteMovie();

  const handleDelete = () => {
    if (!movie) return;

    deleteMovie(movie._id, {
      onSuccess: () => {
        onClose();
      },
      onError: (error: any) => {
        console.error('Delete error:', error);
      },
    });
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Xác nhận xóa phim" centered>
      <Alert icon={<AlertTriangle size={16} />} color="red" mb="md">
        Hành động này không thể hoàn tác!
      </Alert>

      <Text mb="md">
        Bạn có chắc chắn muốn xóa phim <strong>{movie?.title}</strong>?
      </Text>

      <Text size="sm" c="dimmed" mb="xl">
        Lưu ý: Không thể xóa phim nếu còn lịch chiếu đang tồn tại.
      </Text>

      <Group justify="flex-end">
        <Button variant="light" onClick={onClose} disabled={isPending}>
          Hủy
        </Button>
        <Button
          color="red"
          onClick={handleDelete}
          loading={isPending}
          disabled={isPending}
        >
          Xóa phim
        </Button>
      </Group>
    </Modal>
  );
}
