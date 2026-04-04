import {
  Stack,
  Text,
  Paper,
  Title,
  Loader,
  Image,
  Group,
  Divider,
  Button,
  Badge,
  NumberInput,
  ActionIcon,
  Tooltip,
  Progress,
  ThemeIcon,
} from '@mantine/core';
import { useState, useEffect } from 'react';
import { usePayment } from '../hooks/usePayment';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/lib/api-client';
import {
  IconCoins,
  IconRefresh,
  IconSparkles,
  IconCrown,
} from '@tabler/icons-react';

type Props = {
  bookingId: string;
  totalPrice: number;
};

type DiscountInfo = {
  basePrice: number;
  membershipTier: string;
  tierDiscountRate: number;
  tierDiscount: number;
  priceAfterTier: number;
  availablePoints: number;
  maxRedeemablePoints: number;
  redeemPoints: number;
  pointsDiscount: number;
  finalPrice: number;
};

const TIER_COLORS: Record<string, string> = {
  BRONZE: '#cd7f32',
  SILVER: '#a8a9ad',
  GOLD: '#ffd700',
};

const TIER_LABELS: Record<string, string> = {
  BRONZE: 'Đồng',
  SILVER: 'Bạc',
  GOLD: 'Vàng',
};

export function PaymentForm({ bookingId, totalPrice }: Props) {
  const [qrUrl, setQrUrl] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [discount, setDiscount] = useState<DiscountInfo | null>(null);
  const [redeemInput, setRedeemInput] = useState<number | string>(0);
  const [loadingDiscount, setLoadingDiscount] = useState(false);
  const navigate = useNavigate();
  const { mutate: pay } = usePayment();

  // Fetch discount info on mount
  useEffect(() => {
    if (!bookingId) return;
    setLoadingDiscount(true);
    apiClient
      .get(`/booking/${bookingId}/discount`)
      .then((res: any) => {
        setDiscount(res.data as DiscountInfo);
        setRedeemInput(0);
      })
      .catch(() => {})
      .finally(() => setLoadingDiscount(false));
  }, [bookingId]);

  const fetchDiscount = (points: number) => {
    setLoadingDiscount(true);
    apiClient
      .get(`/booking/${bookingId}/discount?redeemPoints=${points}`)
      .then((res: any) => {
        setDiscount(res.data as DiscountInfo);
      })
      .catch(() => {})
      .finally(() => setLoadingDiscount(false));
  };

  const handleRedeemChange = (val: number | string) => {
    setRedeemInput(val);
    const pts = Number(val) || 0;
    fetchDiscount(pts);
  };

  useEffect(() => {
    if (bookingId && !qrUrl) {
      pay(bookingId, {
        onSuccess: (res) => {
          setQrUrl(res.data.paymentUrl);
        },
      });
    }
  }, [bookingId, pay, qrUrl]);

  const handleManualConfirm = () => {
    setIsRedirecting(true);
    const redeemPoints = Number(redeemInput) || 0;
    apiClient
      .patch(`/booking/${bookingId}/confirm-payment`, { redeemPoints })
      .then(() => {
        setTimeout(() => {
          navigate(`/booking/result/${bookingId}`);
        }, 1500);
      });
  };

  const finalPrice = discount?.finalPrice ?? totalPrice;
  const saved = totalPrice - finalPrice;

  return (
    <Stack gap="lg">
      {/* Loyalty Discount Panel */}
      {discount && (
        <Paper
          p="lg"
          radius="lg"
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
          }}
        >
          <Stack gap="md">
            <Group justify="space-between">
              <Group gap="xs">
                <ThemeIcon variant="light" color="violet" size="sm">
                  <IconCrown size={14} />
                </ThemeIcon>
                <Text fw={700} c="white" size="sm">
                  Ưu đãi thành viên
                </Text>
              </Group>
              <Badge
                color="yellow"
                variant="filled"
                style={{
                  backgroundColor: TIER_COLORS[discount.membershipTier],
                }}
              >
                Hạng{' '}
                {TIER_LABELS[discount.membershipTier] ||
                  discount.membershipTier}
              </Badge>
            </Group>

            {/* Tier discount */}
            {discount.tierDiscountRate > 0 && (
              <Group
                justify="space-between"
                py="xs"
                px="sm"
                style={{ background: 'rgba(139,92,246,0.1)', borderRadius: 8 }}
              >
                <Group gap="xs">
                  <IconSparkles size={14} color="#a78bfa" />
                  <Text size="sm" c="violet.3">
                    Giảm theo hạng (
                    {(discount.tierDiscountRate * 100).toFixed(0)}%)
                  </Text>
                </Group>
                <Text fw={700} c="violet.3">
                  -{discount.tierDiscount.toLocaleString('vi-VN')}đ
                </Text>
              </Group>
            )}

            <Divider color="gray.8" />

            {/* Redeem points */}
            <Stack gap="xs">
              <Group justify="space-between">
                <Group gap="xs">
                  <ThemeIcon variant="light" color="yellow" size="sm">
                    <IconCoins size={14} />
                  </ThemeIcon>
                  <Text size="sm" c="gray.3" fw={600}>
                    Dùng điểm thưởng
                  </Text>
                </Group>
                <Text size="xs" c="gray.5">
                  Có:{' '}
                  <Text span c="yellow.4" fw={700}>
                    {discount.availablePoints.toLocaleString()}
                  </Text>{' '}
                  điểm
                </Text>
              </Group>

              <Group gap="xs" align="center">
                <NumberInput
                  placeholder="Nhập số điểm muốn dùng"
                  value={redeemInput}
                  onChange={handleRedeemChange}
                  min={0}
                  max={discount.maxRedeemablePoints}
                  step={10}
                  size="sm"
                  style={{ flex: 1 }}
                  styles={{
                    input: {
                      background: '#0f172a',
                      color: 'white',
                      borderColor: '#334155',
                    },
                  }}
                  rightSection={
                    loadingDiscount ? (
                      <Loader size="xs" color="violet" />
                    ) : undefined
                  }
                />
                <Tooltip label="Dùng tối đa">
                  <ActionIcon
                    variant="light"
                    color="yellow"
                    onClick={() =>
                      handleRedeemChange(discount.maxRedeemablePoints)
                    }
                  >
                    <IconRefresh size={14} />
                  </ActionIcon>
                </Tooltip>
              </Group>

              {discount.maxRedeemablePoints > 0 && (
                <Progress
                  value={
                    (Number(redeemInput) / discount.maxRedeemablePoints) * 100
                  }
                  color="yellow"
                  size="xs"
                  radius="xl"
                />
              )}

              {discount.pointsDiscount > 0 && (
                <Group
                  justify="space-between"
                  py="xs"
                  px="sm"
                  style={{ background: 'rgba(234,179,8,0.1)', borderRadius: 8 }}
                >
                  <Text size="sm" c="yellow.4">
                    Giảm từ điểm ({discount.redeemPoints} điểm)
                  </Text>
                  <Text fw={700} c="yellow.4">
                    -{discount.pointsDiscount.toLocaleString('vi-VN')}đ
                  </Text>
                </Group>
              )}
            </Stack>

            <Divider color="gray.8" />

            {/* Summary */}
            <Group justify="space-between">
              <Text c="gray.4" size="sm">
                Tổng gốc
              </Text>
              <Text c="gray.5" td={saved > 0 ? 'line-through' : undefined}>
                {discount.basePrice.toLocaleString('vi-VN')}đ
              </Text>
            </Group>
            {saved > 0 && (
              <Group justify="space-between">
                <Text c="green.4" size="sm" fw={700}>
                  Tiết kiệm được
                </Text>
                <Text c="green.4" fw={700}>
                  -{saved.toLocaleString('vi-VN')}đ
                </Text>
              </Group>
            )}
            <Group justify="space-between">
              <Text c="white" fw={800} size="lg">
                Thành tiền
              </Text>
              <Text c="yellow.4" fw={800} size="xl">
                {finalPrice.toLocaleString('vi-VN')}đ
              </Text>
            </Group>
          </Stack>
        </Paper>
      )}

      {/* Payment QR */}
      <Paper
        p="xl"
        radius="lg"
        bg="#0f172a"
        ta="center"
        style={{ border: '2px solid #e11d48', color: 'white', minHeight: 400 }}
      >
        <Stack align="center" gap="xl" h="100%" justify="center">
          {!qrUrl ? (
            <Stack align="center">
              <Loader color="yellow" size="xl" />
              <Text c="gray.4" fw={700}>
                ĐANG TẠO MÃ THANH TOÁN...
              </Text>
            </Stack>
          ) : (
            <>
              <Title order={3} c="white" style={{ letterSpacing: '1px' }}>
                QUÉT MÃ VIETQR ĐỂ XÁC NHẬN
              </Title>

              <Paper
                p="sm"
                bg="white"
                radius="md"
                style={{ boxShadow: '0 0 30px rgba(225, 29, 72, 0.3)' }}
              >
                <Image src={qrUrl} w={300} alt="VietQR" />
              </Paper>

              <Stack gap="xs" w="100%">
                <Group gap="xs" justify="center">
                  <Text size="xl" fw={800} c="yellow.5">
                    {finalPrice.toLocaleString('vi-VN')}₫
                  </Text>
                  {saved > 0 && (
                    <Badge color="green" size="sm">
                      -{saved.toLocaleString('vi-VN')}đ
                    </Badge>
                  )}
                </Group>

                {isRedirecting ? (
                  <Group gap="xs" justify="center">
                    <Loader color="green" size="xs" />
                    <Text c="green.4" fw={700}>
                      ĐÃ NHẬN THANH TOÁN!
                    </Text>
                  </Group>
                ) : (
                  <Stack gap="md" w="100%">
                    <Text
                      c="gray.5"
                      size="sm"
                      fw={600}
                      style={{ fontStyle: 'italic' }}
                    >
                      Vui lòng quét mã trên ứng dụng ngân hàng của bạn
                    </Text>
                    <Button
                      color="yellow"
                      size="lg"
                      fullWidth
                      radius="md"
                      onClick={handleManualConfirm}
                      loading={isRedirecting}
                    >
                      TÔI ĐÃ CHUYỂN TIỀN XONG
                    </Button>
                  </Stack>
                )}
              </Stack>

              <Divider
                w="100%"
                color="gray.8"
                style={{ borderStyle: 'dashed' }}
              />

              <Text size="xs" c="gray.6">
                Vui lòng nhấn xác nhận sau khi quét mã thành công.
              </Text>
            </>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
}
