/**
 * TrailerModal — Modal hiển thị trailer YouTube inline
 *
 * Chuyển YouTube URL → embed iframe
 * Không redirect qua tab YouTube
 */

import { Modal } from '@mantine/core';

/**
 * Chuyển YouTube URL thành embed URL
 * Hỗ trợ: youtube.com/watch?v=..., youtu.be/..., youtube.com/embed/...
 */
export const getYouTubeEmbedUrl = (url: string): string | null => {
  const regExp =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0`;
  }
  return null;
};

interface TrailerModalProps {
  opened: boolean;
  onClose: () => void;
  trailerUrl: string;
  movieTitle: string;
}

export default function TrailerModal({
  opened,
  onClose,
  trailerUrl,
  movieTitle,
}: TrailerModalProps) {
  const embedUrl = getYouTubeEmbedUrl(trailerUrl);

  if (!embedUrl) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Trailer — ${movieTitle}`}
      size="xl"
      centered
      padding={0}
      styles={{
        title: {
          fontSize: '1rem',
          fontWeight: 600,
        },
        body: {
          padding: 0,
        },
      }}
    >
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={embedUrl}
          title={`Trailer ${movieTitle}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ border: 'none' }}
        />
      </div>
    </Modal>
  );
}
