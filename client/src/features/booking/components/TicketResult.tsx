import {
  Paper,
  Stack,
  Group,
  Text,
  Title,
  Divider,
  Box,
  Button,
} from '@mantine/core';
import { IconDeviceFloppy, IconShare, IconTicket } from '@tabler/icons-react';
import { QRCodeSVG } from 'qrcode.react';
import type {
  BookingType,
  ShowtimeType,
  MovieType,
  RoomType,
} from '@shared/index';
import moment from 'moment';

type Props = {
  booking: BookingType;
};

export function TicketResult({ booking }: Props) {
  const showtime = booking.showtimeId as unknown as ShowtimeType & {
    movieId: MovieType;
    roomId: RoomType;
  };
  const movie = showtime.movieId;
  const room = showtime.roomId;

  return (
    <Stack gap="xl" align="center" w="100%">
      <Paper
        radius="lg"
        shadow="xl"
        w="100%"
        maw={450}
        bg="white"
        style={{ overflow: 'hidden', color: '#1a1b1e' }}
      >
        <Box
          h={120}
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), #fff), url(${movie.poster})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <Stack p="xl" gap="md" mt={-60}>
          {/* Tên phim & Thông tin */}
          <Stack gap={4} align="center" ta="center">
            <Text c="red.7" fw={800} size="xs" lts={2}>
              E-TICKET
            </Text>
            <Title order={2} style={{ lineHeight: 1.2 }}>
              {movie.title}
            </Title>
            <Text size="sm" c="gray.6">
              {movie.duration} phút • {movie.language}
            </Text>
          </Stack>

          <Divider
            variant="dashed"
            label={<IconTicket color="gray" size={16} />}
            labelPosition="center"
          />

          <Group grow>
            <Stack gap={2}>
              <Text size="xs" c="gray.6" fw={700}>
                NGÀY CHIẾU
              </Text>
              <Text fw={800}>
                {moment(showtime.startTime).format('DD/MM/YYYY')}
              </Text>
            </Stack>
            <Stack gap={2} ta="right">
              <Text size="xs" c="gray.6" fw={700}>
                GIỜ CHIẾU
              </Text>
              <Text fw={800} size="lg" c="red.7">
                {moment(showtime.startTime).format('HH:mm')}
              </Text>
            </Stack>
          </Group>

          <Group grow>
            <Stack gap={2}>
              <Text size="xs" c="gray.6" fw={700}>
                RẠP / PHÒNG
              </Text>
              <Text fw={800}>{room.name}</Text>
            </Stack>
          </Group>

          {/* Ticket Codes List */}
          {(booking as any).tickets && (booking as any).tickets.length > 0 && (
            <Stack gap={4} p="xs" bg="gray.0" style={{ borderRadius: 8 }}>
              <Text size="xs" c="gray.6" fw={700} ta="center">
                DANH SÁCH MÃ VÉ
              </Text>
              <Stack gap={2}>
                {(booking as any).tickets.map((t: any) => (
                  <Group key={t._id} justify="space-between">
                    <Text size="xs" fw={700} c="gray.8">
                      Ghế {t.row}
                      {t.col}
                    </Text>
                    <Text size="xs" fw={800} c="blue.7" ff="monospace">
                      {t.ticketCode}
                    </Text>
                  </Group>
                ))}
              </Stack>
            </Stack>
          )}

          {/* Mã QR để Check-in */}
          <Stack align="center" gap="xs">
            <QRCodeSVG
              value={
                (booking as any).tickets?.[0]?.ticketCode ||
                `booking:${booking._id}`
              }
              size={140}
              level="H"
              includeMargin
            />
          </Stack>
        </Stack>

        <Box bg="gray.1" p="md" ta="center">
          <Text size="xs" c="gray.6">
            Vui lòng đưa mã này cho nhân viên soát vé tại rạp
          </Text>
        </Box>
      </Paper>

      {/* Nút hành động */}
      <Group gap="md">
        <Button
          variant="light"
          color="gray"
          leftSection={<IconDeviceFloppy size={18} />}
        >
          Lưu về máy
        </Button>
        <Button
          variant="light"
          color="gray"
          leftSection={<IconShare size={18} />}
        >
          Chia sẻ
        </Button>
      </Group>
    </Stack>
  );
}
