/**
 * ShowtimeSection — Lịch chiếu theo ngày + chi nhánh
 *
 * UI: Date tabs (Hôm nay, T4, T5...) + dropdown "Toàn quốc" + dropdown "Tất cả rạp"
 * Data: Grouped by cinema → room → time slots
 */

import { useState, useMemo } from 'react';
import { Select } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../lib/api-client';
import { getCinemaCities, getCinemas } from '../services/movies.service';

interface ShowtimeSectionProps {
  movieId: string;
}

// Tên ngày tiếng Việt
const DAY_NAMES = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

// Tạo 7 ngày từ hôm nay
const generateDateTabs = () => {
  const tabs = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const year = date.getFullYear();
    const monthNum = (date.getMonth() + 1).toString().padStart(2, '0');
    const dayNum = date.getDate().toString().padStart(2, '0');

    tabs.push({
      date: `${year}-${monthNum}-${dayNum}`, // Local YYYY-MM-DD (không dùng UTC)
      label: i === 0 ? 'Hôm Nay' : DAY_NAMES[date.getDay()],
      subLabel: `${dayNum}/${monthNum}`,
      isToday: i === 0,
    });
  }

  return tabs;
};

export default function ShowtimeSection({ movieId }: ShowtimeSectionProps) {
  const dateTabs = useMemo(() => generateDateTabs(), []);
  const [selectedDate, setSelectedDate] = useState(dateTabs[0].date);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedCinemaId, setSelectedCinemaId] = useState<string | null>(null);

  // Fetch danh sách thành phố từ API
  const { data: citiesData } = useQuery({
    queryKey: ['cinemas', 'cities'],
    queryFn: getCinemaCities,
    staleTime: 30 * 60 * 1000,
  });

  // Fetch danh sách rạp (lọc theo city nếu có)
  const { data: cinemasData } = useQuery({
    queryKey: ['cinemas', 'list', selectedCity],
    queryFn: () => getCinemas(selectedCity ? { city: selectedCity } : {}),
    staleTime: 10 * 60 * 1000,
  });

  const cities: string[] = (citiesData as any)?.data || [];
  const cinemas: { _id: string; name: string; city: string }[] =
    (cinemasData as any)?.data?.data || (cinemasData as any)?.data || [];

  // Chuẩn bị data cho Select dropdown
  const cityOptions = [
    { value: '', label: 'Toàn quốc' },
    ...cities.map((c) => ({ value: c, label: c })),
  ];

  const cinemaOptions = [
    { value: '', label: 'Tất cả rạp' },
    ...cinemas.map((c) => ({ value: c._id, label: c.name })),
  ];

  // Fetch showtimes cho phim này, lọc theo cinema nếu có
  const { data: showtimesData, isLoading } = useQuery({
    queryKey: ['showtimes', 'movie', movieId, selectedCinemaId],
    queryFn: () =>
      apiClient.get(`/showtimes/movie/${movieId}`, {
        params: selectedCinemaId ? { cinemaId: selectedCinemaId } : {},
      }),
    enabled: !!movieId,
    staleTime: 2 * 60 * 1000,
  });

  // Lọc theo ngày đã chọn
  const showtimesByDate = (showtimesData as any)?.data || [];
  const currentDateShowtimes: any[] =
    showtimesByDate.find?.((d: any) => d.date === selectedDate)?.showtimes ||
    [];

  // Nhóm theo cinema
  const groupedByCinema = useMemo(() => {
    const groups: Record<
      string,
      { cinema: any; rooms: Record<string, any[]> }
    > = {};

    for (const st of currentDateShowtimes) {
      const cinemaId = st.cinemaId?._id || st.cinemaId || 'unknown';
      const roomName = st.roomId?.name || 'Phòng';
      const roomType = st.roomId?.roomType || '';

      if (!groups[cinemaId]) {
        groups[cinemaId] = {
          cinema: typeof st.cinemaId === 'object' ? st.cinemaId : null,
          rooms: {},
        };
      }

      const roomKey = `${roomName}|${roomType}`;
      if (!groups[cinemaId].rooms[roomKey]) {
        groups[cinemaId].rooms[roomKey] = [];
      }
      groups[cinemaId].rooms[roomKey].push(st);
    }

    return Object.values(groups);
  }, [currentDateShowtimes]);

  // Handler khi đổi city → reset cinema
  const handleCityChange = (value: string | null) => {
    setSelectedCity(value || null);
    setSelectedCinemaId(null); // Reset rạp khi đổi tỉnh
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-orange-500 inline-block">
        Lịch Chiếu
      </h3>

      {/* Date Tabs */}
      <div className="flex items-center gap-1 mb-4">
        {/* Previous arrow */}
        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {dateTabs.map((tab) => (
          <button
            key={tab.date}
            onClick={() => setSelectedDate(tab.date)}
            className={`flex flex-col items-center px-4 py-2 rounded-lg transition-all duration-200 min-w-[70px] cursor-pointer ${
              selectedDate === tab.date
                ? 'bg-blue-800 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span className="text-xs font-medium">{tab.label}</span>
            <span
              className={`text-sm font-bold ${selectedDate === tab.date ? 'text-white' : 'text-gray-800'}`}
            >
              {tab.subLabel}
            </span>
          </button>
        ))}

        {/* Next arrow */}
        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* City Filter Dropdown */}
        <Select
          placeholder="Toàn quốc"
          data={cityOptions}
          value={selectedCity || ''}
          onChange={handleCityChange}
          size="sm"
          className="w-[160px]"
          allowDeselect={false}
        />

        {/* Cinema Filter Dropdown */}
        <Select
          placeholder="Tất cả rạp"
          data={cinemaOptions}
          value={selectedCinemaId || ''}
          onChange={(val) => setSelectedCinemaId(val || null)}
          size="sm"
          className="w-[240px]"
          allowDeselect={false}
        />
      </div>

      {/* Showtimes by Cinema */}
      {isLoading ? (
        <div className="py-8 text-center text-gray-400">
          Đang tải lịch chiếu...
        </div>
      ) : groupedByCinema.length === 0 ? (
        <div className="py-8 text-center text-gray-400">
          <p className="text-sm">Chưa có suất chiếu cho ngày này</p>
        </div>
      ) : (
        <div className="space-y-6">
          {groupedByCinema.map((group, idx) => (
            <div key={idx} className="border-t border-gray-200 pt-4">
              {/* Cinema Name */}
              <h4 className="font-bold text-gray-900 mb-3">
                {group.cinema?.name || 'Rạp'}
                {group.cinema?.city && (
                  <span className="text-gray-400 font-normal text-sm ml-2">
                    — {group.cinema.city}
                  </span>
                )}
              </h4>

              {/* Rooms */}
              {Object.entries(group.rooms).map(([roomKey, showtimes]) => {
                const [roomName, roomType] = roomKey.split('|');
                return (
                  <div key={roomKey} className="flex items-center gap-4 mb-3">
                    {/* Room Info */}
                    <div className="min-w-[180px]">
                      <span className="text-sm font-semibold text-gray-700">
                        {roomName}
                      </span>
                      {roomType && (
                        <span className="text-xs text-gray-400 block">
                          {roomType}
                        </span>
                      )}
                    </div>

                    {/* Time Slots */}
                    <div className="flex flex-wrap gap-2">
                      {(showtimes as any[]).map((st: any) => {
                        const time = new Date(st.startTime).toLocaleTimeString(
                          'vi-VN',
                          { hour: '2-digit', minute: '2-digit' },
                        );
                        return (
                          <button
                            key={st._id}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-orange-500 hover:text-orange-500 transition-colors duration-200 cursor-pointer"
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
