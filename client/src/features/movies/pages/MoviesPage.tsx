/**
 * MoviesPage — Trang danh sách phim
 *
 * Tabs: "Đang chiếu" | "Sắp chiếu"
 * Filter: Chọn chi nhánh (tỉnh/thành phố)
 * Grid: MovieCard với hover overlay
 * Compose: CitySelector + MovieCard
 */

import { useState } from 'react';
import { Container, Loader } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  useNowShowing,
  useUpcoming,
  useCinemaCities,
} from '../hooks/useMovies';
import MovieCard from '../../../components/common/MovieCard';
import CitySelector from '../components/CitySelector';
import type { MovieResponse } from '../services/movies.service';

type Tab = 'now-showing' | 'upcoming';

export default function MoviesPage() {
  const [activeTab, setActiveTab] = useState<Tab>('now-showing');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [cityModalOpened, { open: openCityModal, close: closeCityModal }] =
    useDisclosure(false);

  // Fetch data
  const { data: nowShowingData, isLoading: nowShowingLoading } =
    useNowShowing(20);
  const { data: upcomingData, isLoading: upcomingLoading } = useUpcoming(20);
  const { data: citiesData } = useCinemaCities();

  // Chọn data theo tab
  const movies: MovieResponse[] =
    activeTab === 'now-showing'
      ? (nowShowingData as any)?.data || []
      : (upcomingData as any)?.data || [];

  const isLoading =
    activeTab === 'now-showing' ? nowShowingLoading : upcomingLoading;

  const cities: string[] = (citiesData as any)?.data || [];

  const tabs: { key: Tab; label: string }[] = [
    { key: 'now-showing', label: 'Đang chiếu' },
    { key: 'upcoming', label: 'Sắp chiếu' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Container size="xl" className="py-8">
        {/* Header: PHIM + Tabs + City Filter */}
        <div className="flex items-center gap-6 mb-8 border-b border-gray-200 pb-4">
          {/* Title */}
          <div className="flex items-center gap-2">
            <div className="w-1 h-7 bg-blue-800 rounded-full" />
            <h1 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
              Phim
            </h1>
          </div>

          {/* Tabs */}
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'text-blue-800 border-b-2 border-blue-800 bg-transparent'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* City Filter Button */}
          <button
            onClick={openCityModal}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200 border border-orange-200"
          >
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
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {selectedCity || 'Toàn quốc'}
          </button>
        </div>

        {/* Movie Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader size="lg" color="orange" />
          </div>
        ) : movies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <svg
              className="w-16 h-16 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              />
            </svg>
            <p className="text-lg font-medium">Chưa có phim nào</p>
            <p className="text-sm mt-1">Vui lòng quay lại sau</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}
      </Container>

      {/* City Selector Modal */}
      <CitySelector
        opened={cityModalOpened}
        onClose={closeCityModal}
        cities={cities}
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
      />
    </div>
  );
}
