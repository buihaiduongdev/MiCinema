import { useEffect, useMemo, useState } from 'react';
import type { FormEvent, ReactElement } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  BadgeCheck,
  ChevronRight,
  KeyRound,
  LogOut,
  Mail,
  Phone,
  ShieldCheck,
  Ticket,
  UserRound,
} from 'lucide-react';
import { useDisclosure } from '@mantine/hooks';
import { useCancelBooking } from '@/features/booking/hooks/useBooking';
import BookingDetailModal from '../components/BookingDetailModal';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/layout/Navbar';
import { updateMeApi } from '@/features/auth/services/auth.service';
import { useMyBookings } from '@/features/booking/hooks/useMyBookings';
import apiClient from '@/lib/api-client';

type SectionKey = 'info' | 'tickets' | 'password';

type TicketItem = {
  id: string;
  movieTitle: string;
  showtime: string;
  seat: string;
  status: 'PAID' | 'PENDING' | 'CANCELLED';
};

const ticketStatusClasses: Record<TicketItem['status'], string> = {
  PAID: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  PENDING: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  CANCELLED: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
};

const sidebarItems: Array<{
  key: SectionKey;
  label: string;
  icon: ReactElement;
}> = [
  {
    key: 'info',
    label: 'Thông tin',
    icon: <UserRound className="h-4 w-4" />,
  },
  {
    key: 'tickets',
    label: 'Lịch sử đặt vé',
    icon: <Ticket className="h-4 w-4" />,
  },
  {
    key: 'password',
    label: 'Cập nhật thông tin',
    icon: <KeyRound className="h-4 w-4" />,
  },
];

export default function ProfileInfoPage() {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const { data: myBookingsData, isLoading: isLoadingBookings } = useMyBookings(
    1,
    20,
  );
  const [activeSection, setActiveSection] = useState<SectionKey>('info');
  const [profileMessage, setProfileMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const userRecord = (user ?? {}) as Record<string, unknown>;
  //detail
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedBooking, setSelectedBooking] = useState<{
    id: string;
    status: string;
  } | null>(null);
  const { mutate: cancelBooking } = useCancelBooking();
  const handleOpenDetail = (id: string, status: string) => {
    setSelectedBooking({ id, status });
    open();
  };
  const handleCancelBooking = () => {
    if (
      selectedBooking &&
      window.confirm('Bạn có chắc chắn muốn hủy vé này?')
    ) {
      cancelBooking(selectedBooking.id, {
        onSuccess: () => {
          close();
        },
      });
    }
  };
  const displayName =
    typeof userRecord.fullName === 'string' &&
    userRecord.fullName.trim().length > 0
      ? userRecord.fullName
      : 'Cinema Member';
  const displayEmail =
    typeof userRecord.email === 'string'
      ? userRecord.email
      : 'member@micinema.vn';
  const rawPhone = typeof userRecord.phone === 'string' ? userRecord.phone : '';
  const displayPhone = rawPhone || 'Chua cap nhat';
  const memberTier =
    typeof userRecord.membershipTier === 'string'
      ? userRecord.membershipTier
      : 'BRONZE';
  const memberRole =
    typeof userRecord.role === 'string' ? userRecord.role : 'CUSTOMER';
  const totalPoints =
    typeof userRecord.loyaltyPoints === 'number' ? userRecord.loyaltyPoints : 0;
  // const userId = typeof userRecord._id === 'string' ? userRecord._id : 'N/A';
  const fallbackAvatar =
    'https://i.pinimg.com/originals/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg';
  const displayAvatar = user?.avatar?.trim() || fallbackAvatar;

  const [profileForm, setProfileForm] = useState({
    fullName: '',
    phone: '',
    avatar: '',
  });

  useEffect(() => {
    setProfileForm({
      fullName: displayName === 'Cinema Member' ? '' : displayName,
      phone: rawPhone,
      avatar: user?.avatar?.trim() || fallbackAvatar,
    });
  }, [displayName, rawPhone, user?.avatar]);

  const profileCards = useMemo(
    () => [
      {
        key: 'name',
        label: 'Họ tên',
        value: displayName,
        sub: 'Thông tin cá nhân',
        icon: <UserRound className="h-5 w-5 text-rose-300" />,
      },
      {
        key: 'email',
        label: 'Email',
        value: displayEmail,
        sub: 'Liên hệ chính',
        icon: <Mail className="h-5 w-5 text-rose-300" />,
      },
      {
        key: 'phone',
        label: 'Số điện thoại',
        value: displayPhone,
        sub: 'Bảo mật và thông báo',
        icon: <Phone className="h-5 w-5 text-rose-300" />,
      },
      {
        key: 'membership',
        label: 'Hạng thành viên',
        value: memberTier,
        sub: `${totalPoints} điểm tích lũy`,
        icon: <BadgeCheck className="h-5 w-5 text-rose-300" />,
      },
    ],
    [displayName, displayEmail, displayPhone, memberTier, totalPoints],
  );

  const unresolvedShowtimeIds = useMemo(() => {
    const list = myBookingsData?.bookings ?? [];

    return Array.from(
      new Set(
        list
          .map((booking) => {
            const raw = booking.showtimeId;

            if (typeof raw === 'string') return raw;
            if (!raw || typeof raw !== 'object') return '';

            const showtimeObj = raw as Record<string, unknown>;
            const movieObj =
              typeof showtimeObj.movieId === 'object' && showtimeObj.movieId
                ? (showtimeObj.movieId as Record<string, unknown>)
                : null;

            if (movieObj && typeof movieObj.title === 'string') return '';
            if (typeof showtimeObj._id === 'string') return showtimeObj._id;

            return '';
          })
          .filter((id) => id.length > 0),
      ),
    );
  }, [myBookingsData]);

  const { data: showtimeFallbackMap } = useQuery({
    queryKey: ['showtime-fallback', unresolvedShowtimeIds],
    enabled: unresolvedShowtimeIds.length > 0,
    queryFn: async () => {
      const entries = await Promise.all(
        unresolvedShowtimeIds.map(async (id) => {
          try {
            const response = (await apiClient.get(
              `/showtimes/${id}`,
            )) as Record<string, unknown>;
            const showtime = response.data as Record<string, unknown>;
            const movie =
              showtime &&
              typeof showtime.movieId === 'object' &&
              showtime.movieId
                ? (showtime.movieId as Record<string, unknown>)
                : null;
            const room =
              showtime && typeof showtime.roomId === 'object' && showtime.roomId
                ? (showtime.roomId as Record<string, unknown>)
                : null;

            return [
              id,
              {
                title:
                  movie && typeof movie.title === 'string'
                    ? movie.title
                    : undefined,
                startTime:
                  showtime && typeof showtime.startTime === 'string'
                    ? showtime.startTime
                    : undefined,
                roomName:
                  room && typeof room.name === 'string' ? room.name : undefined,
              },
            ] as const;
          } catch {
            return [id, null] as const;
          }
        }),
      );

      return Object.fromEntries(entries) as Record<
        string,
        { title?: string; startTime?: string; roomName?: string } | null
      >;
    },
  });

  const bookingItems = useMemo<TicketItem[]>(() => {
    const list = myBookingsData?.bookings ?? [];

    return list.map((booking) => {
      const showtimeValue = booking.showtimeId;
      const showtimeObject =
        typeof showtimeValue === 'object' && showtimeValue
          ? (showtimeValue as Record<string, unknown>)
          : null;

      const showtimeId =
        typeof showtimeValue === 'string'
          ? showtimeValue
          : showtimeObject && '_id' in showtimeObject
            ? String(showtimeObject._id || '')
            : 'N/A';

      const movieObject =
        showtimeObject && typeof showtimeObject.movieId === 'object'
          ? (showtimeObject.movieId as Record<string, unknown>)
          : null;
      const roomObject =
        showtimeObject && typeof showtimeObject.roomId === 'object'
          ? (showtimeObject.roomId as Record<string, unknown>)
          : null;

      const movieTitle =
        movieObject && typeof movieObject.title === 'string'
          ? movieObject.title
          : showtimeId !== 'N/A' && showtimeFallbackMap?.[showtimeId]?.title
            ? showtimeFallbackMap[showtimeId]?.title
            : undefined;

      const resolvedMovieTitle =
        movieTitle || `Booking #${booking._id.slice(-6).toUpperCase()}`;

      const fallbackStartTimeRaw =
        showtimeId !== 'N/A'
          ? showtimeFallbackMap?.[showtimeId]?.startTime
          : '';
      const fallbackRoomName =
        showtimeId !== 'N/A'
          ? showtimeFallbackMap?.[showtimeId]?.roomName || 'N/A'
          : 'N/A';

      const hasDirectStartTime =
        showtimeObject && typeof showtimeObject.startTime === 'string';
      const startTimeRaw = hasDirectStartTime
        ? String(showtimeObject?.startTime)
        : (fallbackStartTimeRaw ?? '');
      const startTime = startTimeRaw
        ? new Date(startTimeRaw).toLocaleString('vi-VN')
        : 'N/A';

      const roomName =
        roomObject && typeof roomObject.name === 'string'
          ? roomObject.name
          : fallbackRoomName;

      const createdAt = booking.createdAt
        ? new Date(booking.createdAt).toLocaleString('vi-VN')
        : 'N/A';

      const seatLabel = (booking.seats || [])
        .map((s) => `${s.row}${s.col}`)
        .join(', ');

      const safeStatus =
        booking.status === 'PAID' ||
        booking.status === 'PENDING' ||
        booking.status === 'CANCELLED'
          ? booking.status
          : 'PENDING';

      return {
        id: booking._id,
        movieTitle: resolvedMovieTitle,
        showtime: `Dat ve: ${createdAt} - Chieu: ${startTime} - ${roomName}`,
        seat: seatLabel || 'N/A',
        status: safeStatus,
      };
    });
  }, [myBookingsData, showtimeFallbackMap]);

  const handleLogout = () => {
    logout();
  };

  const updateProfileMutation = useMutation({
    mutationFn: updateMeApi,
    onSuccess: async () => {
      setProfileMessage('Cập nhật thông tin cá nhân thành công.');
      await queryClient.invalidateQueries({ queryKey: ['me'] });
    },
    onError: (error) => {
      setProfileMessage(
        error.message || 'Cập nhật thất bại, vui lòng thử lại.',
      );
    },
  });

  const handlePasswordSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordMessage(
      'Tính năng đổi mật khẩu đang được hoàn thiện. Vui lòng thử lại sau.',
    );
  };

  const handleProfileSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfileMessage('');
    updateProfileMutation.mutate({
      fullName: profileForm.fullName.trim(),
      phone: profileForm.phone.trim(),
      avatar: profileForm.avatar.trim(),
    });
  };

  const renderSectionContent = () => {
    if (activeSection === 'info') {
      return (
        <section className="px-4 py-10 sm:px-8 lg:px-10">
          <div className="mb-6 flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-rose-300" />
            <h2 className="text-xl font-bold sm:text-2xl">
              Thông tin tài khoản
            </h2>
          </div>
          <div className="mb-5 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-4">
              <img
                src={displayAvatar}
                alt="Avatar"
                className="h-16 w-16 rounded-xl object-cover ring-1 ring-white/20"
                onError={(event) => {
                  if (event.currentTarget.src !== fallbackAvatar) {
                    event.currentTarget.src = fallbackAvatar;
                  }
                }}
              />
              <div>
                <p className="text-lg font-bold">{displayName}</p>
                <p className="text-sm text-white/65">
                  {memberRole} - {memberTier}
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {profileCards.map((card) => (
              <article
                key={card.key}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-lg bg-rose-500/15 p-2">
                    {card.icon}
                  </div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60">
                    {card.label}
                  </p>
                </div>
                <p className="text-lg font-bold leading-tight">{card.value}</p>
                <p className="mt-3 border-t border-white/10 pt-3 text-xs text-white/55">
                  {card.sub}
                </p>
              </article>
            ))}
          </div>
        </section>
      );
    }

    if (activeSection === 'tickets') {
      return (
        <section className="px-4 py-10 sm:px-8 lg:px-10">
          <div className="mb-6 flex items-center gap-3">
            <Ticket className="h-5 w-5 text-rose-300" />
            <h2 className="text-xl font-bold sm:text-2xl">Lịch sử đặt vé</h2>
          </div>
          {isLoadingBookings && (
            <p className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
              Đang tải lịch sử đặt vé...
            </p>
          )}
          {!isLoadingBookings && bookingItems.length === 0 && (
            <p className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
              Chưa có lịch sử đặt vé.
            </p>
          )}
          <div className="space-y-3">
            {bookingItems.map((ticket) => (
              <article
                key={ticket.id}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-gradient-to-r from-white/5 to-white/[0.03] p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  {/* <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                    {ticket.id}
                  </p> */}
                  <p className="mt-1 text-lg font-bold">{ticket.movieTitle}</p>
                  <p className="mt-1 text-sm text-white/65">
                    {ticket.showtime}
                  </p>
                  <p className="mt-1 text-sm text-white/80">
                    Ghe: {ticket.seat}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold tracking-wider ${ticketStatusClasses[ticket.status]}`}
                  >
                    {ticket.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenDetail(ticket.id, ticket.status)}
                    className="rounded-lg border border-white/20 px-3 py-2 text-sm font-semibold transition hover:bg-white/10"
                  >
                    Chi tiết
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      );
    }

    return (
      <section className="px-4 py-10 sm:px-8 lg:px-10">
        <div className="mb-6 flex items-center gap-3">
          <KeyRound className="h-5 w-5 text-rose-300" />
          <h2 className="text-xl font-bold sm:text-2xl">Cập nhật thông tin</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="mb-4 text-lg font-bold">Thông tin cá nhân</h3>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* <div>
                  <label className="mb-1 block text-sm font-semibold text-white/80">
                    User ID
                  </label>
                  <input
                    type="text"
                    value={userId}
                    readOnly
                    className="w-full rounded-lg border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white/70 outline-none"
                  />
                </div> */}
                <div>
                  <label className="mb-1 block text-sm font-semibold text-white/80">
                    Email
                  </label>
                  <input
                    type="email"
                    value={displayEmail}
                    readOnly
                    className="w-full rounded-lg border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white/70 outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-white/80">
                    Hạng thành viên
                  </label>
                  <input
                    type="text"
                    value={memberTier}
                    readOnly
                    className="w-full rounded-lg border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white/70 outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-white/80">
                    Điểm tích lũy
                  </label>
                  <input
                    type="text"
                    value={String(totalPoints)}
                    readOnly
                    className="w-full rounded-lg border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white/70 outline-none"
                  />
                </div>
              </div>

              <div className="my-2 border-t border-white/10" />

              <div>
                <label className="mb-2 block text-sm font-semibold text-white/80">
                  Avatar
                </label>
                <div className="flex items-center gap-4">
                  <img
                    src={profileForm.avatar.trim() || fallbackAvatar}
                    alt="Avatar preview"
                    className="h-16 w-16 rounded-xl object-cover ring-1 ring-white/20"
                    onError={(event) => {
                      if (event.currentTarget.src !== fallbackAvatar) {
                        event.currentTarget.src = fallbackAvatar;
                      }
                    }}
                  />
                  <input
                    type="url"
                    value={profileForm.avatar}
                    onChange={(event) =>
                      setProfileForm((prev) => ({
                        ...prev,
                        avatar: event.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-white/15 bg-black/40 px-4 py-2.5 text-sm outline-none ring-0 transition placeholder:text-white/30 focus:border-rose-400"
                    placeholder="Nhập URL avatar"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-white/80">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={profileForm.fullName}
                  onChange={(event) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      fullName: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-white/15 bg-black/40 px-4 py-2.5 text-sm outline-none ring-0 transition placeholder:text-white/30 focus:border-rose-400"
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-white/80">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(event) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      phone: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-white/15 bg-black/40 px-4 py-2.5 text-sm outline-none ring-0 transition placeholder:text-white/30 focus:border-rose-400"
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="mt-2 rounded-lg bg-rose-500 px-5 py-2.5 text-sm font-bold text-black transition hover:bg-rose-400"
              >
                {updateProfileMutation.isPending
                  ? 'Đang cập nhật...'
                  : 'Cập nhật thông tin'}
              </button>
            </form>
            {profileMessage && (
              <p className="mt-4 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
                {profileMessage}
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="mb-4 text-lg font-bold">Đổi mật khẩu</h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-white/80">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-white/15 bg-black/40 px-4 py-2.5 text-sm outline-none ring-0 transition placeholder:text-white/30 focus:border-rose-400"
                  placeholder="Nhập mật khẩu hiện tại"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-white/80">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-white/15 bg-black/40 px-4 py-2.5 text-sm outline-none ring-0 transition placeholder:text-white/30 focus:border-rose-400"
                  placeholder="Nhập mật khẩu mới"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-white/80">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-white/15 bg-black/40 px-4 py-2.5 text-sm outline-none ring-0 transition placeholder:text-white/30 focus:border-rose-400"
                  placeholder="Nhập lại mật khẩu mới"
                  required
                />
              </div>
              <button
                type="submit"
                className="mt-2 rounded-lg bg-rose-500 px-5 py-2.5 text-sm font-bold text-black transition hover:bg-rose-400"
              >
                Cập nhật mật khẩu
              </button>
            </form>
            {passwordMessage && (
              <p className="mt-4 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
                {passwordMessage}
              </p>
            )}
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white">
      <Navbar />

      <div className="mx-auto flex w-full max-w-[1600px] pt-4">
        <aside className="sticky top-20 hidden h-[calc(100vh-6rem)] w-72 shrink-0 rounded-r-2xl border-r border-white/10 bg-[#09090b] p-5 lg:flex lg:flex-col">
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="truncate text-sm font-semibold">{displayName}</p>
            <p className="mt-1 truncate text-xs uppercase tracking-wider text-rose-300/90">
              {memberRole} - {memberTier}
            </p>
          </div>

          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const isActive = activeSection === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveSection(item.key)}
                  className={`group flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm transition ${
                    isActive
                      ? 'bg-gradient-to-r from-rose-500/25 to-rose-300/10 text-rose-200'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    {item.icon}
                    {item.label}
                  </span>
                  <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </button>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20"
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </button>
        </aside>

        <main className="w-full lg:ml-0">
          <div className="sticky top-0 z-30 flex gap-2 overflow-x-auto border-b border-white/10 bg-black/40 px-4 py-3 backdrop-blur lg:hidden">
            {sidebarItems.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveSection(item.key)}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
                  activeSection === item.key
                    ? 'bg-rose-500/30 text-rose-100'
                    : 'bg-white/5 text-white/70'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              type="button"
              onClick={handleLogout}
              className="whitespace-nowrap rounded-full bg-rose-500/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-100"
            >
              Đăng xuất
            </button>
          </div>

          <section className="relative h-[240px] w-full sm:h-[280px]">
            <img
              src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1800&h=900&fit=crop"
              alt="Cinema"
              className="h-full w-full object-cover opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-[#0d0d0f]" />
            <div className="absolute inset-x-0 bottom-8 px-4 sm:px-8 lg:px-10">
              <div className="pb-1">
                <span className="mb-2 inline-flex rounded-sm bg-rose-500/25 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-rose-200">
                  Information
                </span>
                <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
                  {displayName}
                </h1>
                <p className="mt-1 text-sm text-white/70 sm:text-base">
                  Hồ sơ thành viên Micinema
                </p>
              </div>
            </div>
          </section>

          <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm m-4 sm:m-6 lg:m-8">
            {renderSectionContent()}
          </div>
        </main>
      </div>
      {selectedBooking && (
        <BookingDetailModal
          opened={opened}
          onClose={close}
          bookingId={selectedBooking.id}
          status={selectedBooking.status}
          onCancel={handleCancelBooking}
        />
      )}
    </div>
  );
}
