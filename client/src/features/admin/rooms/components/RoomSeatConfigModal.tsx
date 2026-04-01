import { useEffect, useMemo, useState } from 'react';
import { Button, Modal, NumberInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { SEAT_TYPE } from '@shared/constants/seat-types';
import type { SeatConfig } from '@shared/schemas/room.schema';
import { useAdminRoomById, useUpdateRoom } from '../hooks/useRoomCRUD';

const ROW_LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const SEAT_LABELS: Record<string, string> = {
  [SEAT_TYPE.NORMAL]: 'Thường',
  [SEAT_TYPE.VIP]: 'VIP',
  [SEAT_TYPE.SWEETBOX]: 'Sweetbox',
};

function buildDefaultSeats(rows: number, cols: number): SeatConfig[] {
  const seats: SeatConfig[] = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 1; j <= cols; j++) {
      const row = ROW_LABELS[i];
      seats.push({
        seatId: `${row}${j}`,
        row,
        col: j,
        type: SEAT_TYPE.NORMAL,
        isActive: true,
      });
    }
  }
  return seats;
}

function cycleSeat(s: SeatConfig): SeatConfig {
  if (!s.isActive) {
    return { ...s, type: SEAT_TYPE.NORMAL, isActive: true };
  }
  if (s.type === SEAT_TYPE.NORMAL) return { ...s, type: SEAT_TYPE.VIP };
  if (s.type === SEAT_TYPE.VIP) return { ...s, type: SEAT_TYPE.SWEETBOX };
  return { ...s, isActive: false };
}

function seatButtonClass(s: SeatConfig) {
  if (!s.isActive) {
    return 'bg-[#1a1f2e] text-[#5c6175] line-through border border-[#2d3449]';
  }
  if (s.type === SEAT_TYPE.VIP) {
    return 'bg-amber-900/40 text-amber-200 border border-amber-700/50';
  }
  if (s.type === SEAT_TYPE.SWEETBOX) {
    return 'bg-pink-900/30 text-pink-200 border border-pink-700/40';
  }
  return 'bg-[#222a3d] text-[#dae2fd] border border-[#424656]';
}

type Props = {
  roomId: string | null;
  opened: boolean;
  onClose: () => void;
};

export function RoomSeatConfigModal({ roomId, opened, onClose }: Props) {
  const { data: room, isLoading } = useAdminRoomById(
    roomId ?? undefined,
    opened,
  );
  const updateRoom = useUpdateRoom();

  const [draftRows, setDraftRows] = useState(1);
  const [draftCols, setDraftCols] = useState(1);
  const [draftSeats, setDraftSeats] = useState<SeatConfig[]>([]);

  useEffect(() => {
    if (room && opened) {
      setDraftRows(room.rows);
      setDraftCols(room.cols);
      setDraftSeats(room.seats.map((s) => ({ ...s })));
    }
  }, [room, opened]);

  const gridOk =
    draftSeats.length === draftRows * draftCols &&
    draftRows > 0 &&
    draftCols > 0;

  const grid = useMemo(() => {
    const byPos = new Map<string, SeatConfig>();
    for (const s of draftSeats) {
      byPos.set(`${s.row}-${s.col}`, s);
    }
    const rows: SeatConfig[][] = [];
    for (let i = 0; i < draftRows; i++) {
      const rowLetter = ROW_LABELS[i];
      const r: SeatConfig[] = [];
      for (let j = 1; j <= draftCols; j++) {
        const cell = byPos.get(`${rowLetter}-${j}`);
        if (cell) r.push(cell);
      }
      if (r.length === draftCols) rows.push(r);
    }
    return rows;
  }, [draftSeats, draftRows, draftCols]);

  const applyGridSize = () => {
    const r = Number(draftRows);
    const c = Number(draftCols);
    if (!Number.isFinite(r) || !Number.isFinite(c) || r < 1 || c < 1) {
      notifications.show({
        color: 'red',
        title: 'Lỗi',
        message: 'Số hàng/cột không hợp lệ.',
      });
      return;
    }
    if (r > 26 || c > 40) {
      notifications.show({
        color: 'red',
        title: 'Lỗi',
        message: 'Tối đa 26 hàng và 40 cột.',
      });
      return;
    }
    if (room && (r !== room.rows || c !== room.cols)) {
      if (
        !window.confirm(
          'Đổi kích thước sẽ tạo lại lưới ghế mặc định (mất cấu hình loại ghế hiện tại). Tiếp tục?',
        )
      ) {
        return;
      }
    }
    setDraftRows(r);
    setDraftCols(c);
    setDraftSeats(buildDefaultSeats(r, c));
  };

  const toggleSeat = (seat: SeatConfig) => {
    setDraftSeats((prev) =>
      prev.map((s) => (s.seatId === seat.seatId ? cycleSeat(s) : s)),
    );
  };

  const handleSave = async () => {
    if (!roomId) return;
    if (!gridOk) {
      notifications.show({
        color: 'yellow',
        title: 'Chưa khớp lưới',
        message:
          'Nhấn «Áp dụng kích thước» sau khi đổi số hàng/cột, hoặc chỉnh lại cho đúng rows × cols.',
      });
      return;
    }
    try {
      await updateRoom.mutateAsync({
        id: roomId,
        body: {
          rows: draftRows,
          cols: draftCols,
          seats: draftSeats,
        },
      });
      notifications.show({
        color: 'green',
        title: 'Đã lưu',
        message: 'Cấu hình ghế đã được cập nhật.',
      });
      onClose();
    } catch (e: unknown) {
      notifications.show({
        color: 'red',
        title: 'Lỗi',
        message: e instanceof Error ? e.message : 'Không lưu được.',
      });
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Cấu hình ghế (UC-28)"
      size="xl"
      styles={{
        content: { backgroundColor: '#131b2e', maxWidth: 'min(96vw, 1100px)' },
        header: { backgroundColor: '#131b2e', color: '#dae2fd' },
        title: { fontWeight: 'bold', fontSize: '1.1rem' },
        body: { maxHeight: '80vh', overflowY: 'auto' },
      }}
    >
      {isLoading || !room ? (
        <p className="text-[#8c90a1]">Đang tải...</p>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-[#8c90a1]">
            Nhấn từng ghế để xoay: Thường → VIP → Sweetbox → Vô hiệu → Thường.
            Nếu còn suất chiếu sắp tới, chỉ đổi loại/ghế tắt, không đổi kích
            thước lưới.
          </p>
          {!gridOk && (
            <p className="text-sm text-amber-200/90 bg-amber-950/30 border border-amber-800/40 rounded-lg px-3 py-2">
              Số ghế hiện tại không khớp {draftRows} × {draftCols}. Nhấn «Áp
              dụng kích thước» để đồng bộ lưới trước khi lưu.
            </p>
          )}
          <div className="flex flex-wrap items-end gap-3">
            <NumberInput
              label="Số hàng"
              min={1}
              max={26}
              value={draftRows}
              onChange={(v) => setDraftRows(typeof v === 'number' ? v : 1)}
              styles={{
                input: {
                  backgroundColor: '#060e20',
                  border: 'none',
                  color: '#dae2fd',
                  maxWidth: 100,
                },
              }}
              labelProps={{ style: { color: '#c2c6d8' } }}
            />
            <NumberInput
              label="Số cột"
              min={1}
              max={40}
              value={draftCols}
              onChange={(v) => setDraftCols(typeof v === 'number' ? v : 1)}
              styles={{
                input: {
                  backgroundColor: '#060e20',
                  border: 'none',
                  color: '#dae2fd',
                  maxWidth: 100,
                },
              }}
              labelProps={{ style: { color: '#c2c6d8' } }}
            />
            <Button
              variant="light"
              color="gray"
              onClick={applyGridSize}
              styles={{
                root: { backgroundColor: '#222a3d', color: '#dae2fd' },
              }}
            >
              Áp dụng kích thước
            </Button>
          </div>
          <div className="overflow-x-auto pb-2">
            <div className="inline-block min-w-full">
              <div
                className="grid gap-1 mb-1"
                style={{
                  gridTemplateColumns: `32px repeat(${draftCols}, minmax(28px,1fr))`,
                }}
              >
                <div />
                {Array.from({ length: draftCols }, (_, i) => (
                  <div
                    key={i}
                    className="text-center text-[10px] text-[#8c90a1] font-semibold"
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              {grid.map((rowSeats, ri) => (
                <div
                  key={ROW_LABELS[ri]}
                  className="grid gap-1 mb-1 items-center"
                  style={{
                    gridTemplateColumns: `32px repeat(${draftCols}, minmax(28px,1fr))`,
                  }}
                >
                  <span className="text-xs text-[#8c90a1] font-bold text-center">
                    {ROW_LABELS[ri]}
                  </span>
                  {rowSeats.map((s) => (
                    <button
                      key={s.seatId}
                      type="button"
                      title={`${s.seatId}: ${SEAT_LABELS[s.type] ?? s.type}${!s.isActive ? ' (tắt)' : ''}`}
                      onClick={() => toggleSeat(s)}
                      className={`h-8 rounded text-[10px] font-bold transition hover:opacity-90 ${seatButtonClass(s)}`}
                    >
                      {s.col}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-2 border-t border-[#424656]/40">
            <Button variant="subtle" color="gray" onClick={onClose}>
              Hủy
            </Button>
            <Button
              loading={updateRoom.isPending}
              onClick={() => void handleSave()}
              styles={{ root: { background: '#0066ff', fontWeight: 700 } }}
            >
              Lưu cấu hình ghế
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
