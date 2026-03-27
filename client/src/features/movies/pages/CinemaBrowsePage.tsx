/**
 * CinemaBrowsePage — /dien-anh
 *
 * Trang duyệt phim toàn bộ (tất cả status):
 * - Bộ lọc: Thể loại, Quốc gia, Năm, Đang chiếu/Sắp chiếu, Sắp xếp
 * - Layout: Poster ngang + thông tin bên phải (list view)
 * - Sidebar: Phim đang chiếu
 * - Phân trang
 */

import { useSearchParams, Link } from 'react-router-dom';
import { Select, Pagination, Container, Badge, Loader } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import {
  getMovies,
  getGenres,
  getCountries,
  getYears,
  getNowShowing,
  type MovieResponse,
} from '../services/movies.service';

// Các option sắp xếp
const SORT_OPTIONS = [
  { value: 'viewCount:desc', label: 'Xem nhiều nhất' },
  { value: 'releaseDate:desc', label: 'Mới nhất' },
  { value: 'rating:desc', label: 'Đánh giá tốt nhất' },
  { value: 'title:asc', label: 'Tên A-Z' },
];

// Trạng thái options
const STATUS_OPTIONS = [
  { value: '', label: 'Tất cả' },
  { value: 'RELEASED', label: 'Đang chiếu' },
  { value: 'UPCOMING', label: 'Sắp chiếu' },
  { value: 'ENDED', label: 'Đã kết thúc' },
];

export default function CinemaBrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Đọc filter từ URL
  const genre = searchParams.get('genre') || '';
  const country = searchParams.get('country') || '';
  const year = searchParams.get('year') || '';
  const status = searchParams.get('status') || '';
  const sort = searchParams.get('sort') || 'viewCount:desc';
  const page = Number(searchParams.get('page')) || 1;

  const [sortBy, sortOrder] = sort.split(':');

  // Ghi filter vào URL
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset về trang 1 khi đổi filter
    if (key !== 'page') params.set('page', '1');
    setSearchParams(params);
  };

  // Fetch filter options
  const { data: genresData } = useQuery({
    queryKey: ['genres'],
    queryFn: getGenres,
    staleTime: 30 * 60 * 1000,
  });

  const { data: countriesData } = useQuery({
    queryKey: ['movies', 'countries'],
    queryFn: getCountries,
    staleTime: 30 * 60 * 1000,
  });

  const { data: yearsData } = useQuery({
    queryKey: ['movies', 'years'],
    queryFn: getYears,
    staleTime: 30 * 60 * 1000,
  });

  // Fetch movies list
  const { data: moviesData, isLoading } = useQuery({
    queryKey: [
      'movies',
      'browse',
      genre,
      country,
      year,
      status,
      sortBy,
      sortOrder,
      page,
    ],
    queryFn: () =>
      getMovies({
        ...(genre && { genre }),
        ...(country && { country }),
        ...(year && { year }),
        ...(status && { status }),
        sortBy: sortBy || 'viewCount',
        sortOrder: sortOrder || 'desc',
        page,
        limit: 10,
      }),
    staleTime: 2 * 60 * 1000,
  });

  // Sidebar: phim đang chiếu
  const { data: nowShowingData } = useQuery({
    queryKey: ['movies', 'now-showing', 4],
    queryFn: () => getNowShowing(4),
    staleTime: 5 * 60 * 1000,
  });

  // Parse data
  const genres: { _id: string; name: string }[] =
    (genresData as any)?.data || [];
  const countries: string[] = (countriesData as any)?.data || [];
  const years: number[] = (yearsData as any)?.data || [];
  const movies: MovieResponse[] = (moviesData as any)?.data?.data || [];
  const pagination = (moviesData as any)?.data?.pagination;
  const nowShowingMovies: MovieResponse[] = (nowShowingData as any)?.data || [];

  // Build dropdown data
  const genreOptions = [
    { value: '', label: 'Thể Loại' },
    ...genres.map((g) => ({ value: g._id, label: g.name })),
  ];

  const countryOptions = [
    { value: '', label: 'Quốc Gia' },
    ...countries.map((c) => ({ value: c, label: c })),
  ];

  const yearOptions = [
    { value: '', label: 'Năm' },
    ...years.map((y) => ({ value: String(y), label: String(y) })),
  ];

  // Tìm tên genre đang chọn (cho heading)
  const selectedGenreName = genre
    ? genres.find((g) => g._id === genre)?.name
    : null;

  return (
    <div className="min-h-screen bg-white">
      <Container size="xl" className="py-8">
        {/* Page Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-blue-800 rounded-full" />
          <h1 className="text-2xl font-bold text-gray-900 uppercase">
            Phim Điện Ảnh
            {selectedGenreName && (
              <span className="text-blue-700 ml-2">— {selectedGenreName}</span>
            )}
          </h1>
        </div>

        {/* Main Layout: Content + Sidebar */}
        <div className="flex gap-8">
          {/* LEFT: Filters + Movie List */}
          <div className="flex-1 min-w-0">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <Select
                data={genreOptions}
                value={genre}
                onChange={(v) => updateFilter('genre', v || '')}
                size="sm"
                className="w-[160px]"
                allowDeselect={false}
                placeholder="Thể Loại"
              />
              <Select
                data={countryOptions}
                value={country}
                onChange={(v) => updateFilter('country', v || '')}
                size="sm"
                className="w-[160px]"
                allowDeselect={false}
                placeholder="Quốc Gia"
              />
              <Select
                data={yearOptions}
                value={year}
                onChange={(v) => updateFilter('year', v || '')}
                size="sm"
                className="w-[120px]"
                allowDeselect={false}
                placeholder="Năm"
              />
              <Select
                data={STATUS_OPTIONS}
                value={status}
                onChange={(v) => updateFilter('status', v || '')}
                size="sm"
                className="w-[180px]"
                allowDeselect={false}
                placeholder="Đang Chiếu/Sắp"
              />
              <Select
                data={SORT_OPTIONS}
                value={sort}
                onChange={(v) => updateFilter('sort', v || 'viewCount:desc')}
                size="sm"
                className="w-[200px]"
                allowDeselect={false}
              />
            </div>

            {/* Movie List */}
            {isLoading ? (
              <div className="flex justify-center py-16">
                <Loader size="lg" color="blue" />
              </div>
            ) : movies.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                Không tìm thấy phim nào
              </div>
            ) : (
              <div className="space-y-6">
                {movies.map((movie) => (
                  <MovieListItem key={movie._id} movie={movie} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination
                  total={pagination.totalPages}
                  value={pagination.currentPage}
                  onChange={(p) => updateFilter('page', String(p))}
                  color="blue"
                  size="md"
                  radius="md"
                  withEdges
                />
              </div>
            )}
          </div>

          {/* RIGHT: Sidebar */}
          <div className="w-[300px] flex-shrink-0 hidden lg:block">
            {/* Phim đang chiếu */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-blue-800 text-white text-center py-3 font-bold text-sm uppercase">
                Phim Đang Chiếu
              </div>
              <div className="p-3 flex flex-col gap-4">
                {nowShowingMovies.map((movie) => (
                  <Link
                    key={movie._id}
                    to={`/phim/${movie.slug}`}
                    className="block group no-underline"
                  >
                    <div className="relative overflow-hidden rounded-lg">
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full h-[160px] object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute bottom-2 right-2 flex items-center gap-1">
                        {movie.rating > 0 && (
                          <Badge color="yellow" size="sm" variant="filled">
                            <span className="flex items-center gap-1">
                              <svg
                                className="w-3 h-3 text-white fill-white"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              {movie.rating}
                            </span>
                          </Badge>
                        )}
                        <Badge color="orange" size="sm" variant="filled">
                          {movie.ageRating}
                        </Badge>
                      </div>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-gray-800 group-hover:text-blue-700 transition-colors line-clamp-1">
                      {movie.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

// ===== SUB-COMPONENT: MovieListItem =====

function MovieListItem({ movie }: { movie: MovieResponse }) {
  return (
    <Link
      to={`/phim/${movie.slug}`}
      className="flex gap-5 p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-blue-300 transition-all duration-200 no-underline group"
    >
      {/* Poster */}
      <div className="w-[150px] h-[220px] flex-shrink-0 overflow-hidden rounded-lg">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors mb-2 uppercase">
          {movie.title}
        </h3>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge
            color="green"
            variant="filled"
            size="sm"
            leftSection={
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
            }
          >
            Thích
          </Badge>
          <Badge
            color="gray"
            variant="outline"
            size="sm"
            leftSection={
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            }
          >
            {movie.viewCount?.toLocaleString() || 0}
          </Badge>
          {movie.rating > 0 && (
            <Badge color="yellow" variant="filled" size="sm">
              <span className="flex items-center gap-1">
                <svg
                  className="w-3 h-3 text-white fill-white"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {movie.rating}
              </span>
            </Badge>
          )}
          <Badge
            size="sm"
            variant="light"
            color={
              movie.status === 'RELEASED'
                ? 'green'
                : movie.status === 'UPCOMING'
                  ? 'blue'
                  : 'gray'
            }
          >
            {movie.status === 'RELEASED'
              ? 'Đang chiếu'
              : movie.status === 'UPCOMING'
                ? 'Sắp chiếu'
                : 'Đã kết thúc'}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-4 mb-3">
          {movie.description}
        </p>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 font-medium">
          {movie.genres?.length > 0 && (
            <span className="flex items-center">
              <svg
                className="w-3.5 h-3.5 inline-block mr-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                />
              </svg>
              {movie.genres.map((g) => g.name).join(', ')}
            </span>
          )}
          {movie.country && (
            <span className="flex items-center">
              <svg
                className="w-3.5 h-3.5 inline-block mr-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
              {movie.country}
            </span>
          )}
          <span className="flex items-center">
            <svg
              className="w-3.5 h-3.5 inline-block mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {movie.duration} phút
          </span>
          <span className="flex items-center">
            <svg
              className="w-3.5 h-3.5 inline-block mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {new Date(movie.releaseDate).toLocaleDateString('vi-VN')}
          </span>
        </div>
      </div>
    </Link>
  );
}
