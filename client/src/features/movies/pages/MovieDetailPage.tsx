/**
 * MovieDetailPage — Trang chi tiết phim
 *
 * URL: /phim/:slug
 * Compose: MovieDetail + ShowtimeSection + Sidebar (Phim đang chiếu)
 * Dùng: useMovieBySlug(), useNowShowing(), useRelatedMovies()
 */

import { useParams } from 'react-router-dom';
import { Container, Loader } from '@mantine/core';
import { useMovieBySlug } from '../hooks/useMovieDetail';
import { useNowShowing } from '../hooks/useMovies';
import MovieDetail from '../components/MovieDetail';
import ShowtimeSection from '../components/ShowtimeList';
import MovieCard from '../../../components/common/MovieCard';
import type { MovieResponse } from '../services/movies.service';

export default function MovieDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: movieData, isLoading, isError } = useMovieBySlug(slug || '');
  const { data: nowShowingData } = useNowShowing(6);

  const movie: MovieResponse | null = (movieData as any)?.data || null;
  const nowShowingMovies: MovieResponse[] = (nowShowingData as any)?.data || [];

  // Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="xl" color="orange" />
      </div>
    );
  }

  // Error State
  if (isError || !movie) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
        <svg
          className="w-20 h-20 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="text-xl font-bold mb-2">Không tìm thấy phim</h2>
        <p className="text-sm">Phim này có thể đã bị xóa hoặc không tồn tại.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Banner + Info (full width) */}
      <MovieDetail movie={movie} />

      {/* Showtime + Sidebar */}
      <Container size="xl" className="-mt-4">
        <div className="flex gap-8">
          {/* LEFT: Showtime Section */}
          <div className="flex-1 min-w-0">
            <ShowtimeSection movieId={movie._id} slug={slug || '404'} />
          </div>

          {/* RIGHT: Sidebar — Phim đang chiếu */}
          <div className="hidden lg:block w-[260px] shrink-0">
            <div className="sticky top-4">
              {/* Section Title */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-orange-500 rounded-full" />
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                  Phim đang chiếu
                </h3>
              </div>

              {/* Movie Cards (vertical list) */}
              <div className="flex flex-col gap-4">
                {nowShowingMovies
                  .filter((m) => m._id !== movie._id)
                  .slice(0, 4)
                  .map((m) => (
                    <MovieCard key={m._id} movie={m} />
                  ))}
              </div>

              {/* Xem thêm */}
              <a
                href="/phim"
                className="mt-4 flex items-center justify-center gap-1 text-sm text-orange-500 hover:text-orange-600 font-medium border border-orange-200 rounded-lg px-4 py-2 transition-colors duration-200"
              >
                Xem thêm
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
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
