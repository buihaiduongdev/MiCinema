import { useMemo } from 'react';
import HeroSection from '@/components/common/HeroSection';
import TrendingCard from '@/components/common/TrendingCard';
import HorizontalScrollSection from '@/components/common/HorizontalScrollSection';
import BentoGrid from '@/components/common/BentoGrid';
import { useMovies } from '@/features/movies/hooks/useMovies';
import type { MovieResponse } from '@/features/movies/services/movies.service';
import { formatDate, formatDuration } from '@/utils/format';

type HomeMovie = MovieResponse & {
  releaseDate: string | Date;
  createdAt?: string | Date;
  slug?: string;
  language?: string;
  audioType?: string;
  ageRating?: string;
  country?: string;
  viewCount?: number;
  directors?: unknown[];
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

const getEntityLabel = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (!isRecord(value)) return '';

  const keys = ['name', 'title', 'fullName'];
  for (const key of keys) {
    const field = value[key];
    if (typeof field === 'string' && field.trim().length > 0) return field;
  }

  return '';
};

const getListLabels = (values: unknown, fallback = 'N/A'): string => {
  if (!Array.isArray(values) || values.length === 0) return fallback;

  const labels = values
    .map(getEntityLabel)
    .filter((item) => item.trim().length > 0)
    .slice(0, 3);

  return labels.length > 0 ? labels.join(' • ') : fallback;
};

export default function HomePage() {
  const fallbackPoster =
    'https://images.unsplash.com/photo-1489599856769-c5ae6f84f5a7?w=800&h=1200&fit=crop';
  const fallbackHero =
    'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=1920&h=1080&fit=crop';

  const {
    data: moviesResponse,
    isLoading,
    isError,
  } = useMovies({
    page: 1,
    limit: 24,
  });

  const normalizedMovies = useMemo<HomeMovie[]>(() => {
    if (Array.isArray(moviesResponse)) {
      return moviesResponse as HomeMovie[];
    }

    if (!isRecord(moviesResponse)) {
      return [];
    }

    const level1Data = moviesResponse.data;
    if (Array.isArray(level1Data)) {
      return level1Data as HomeMovie[];
    }

    if (isRecord(level1Data) && Array.isArray(level1Data.data)) {
      return level1Data.data as HomeMovie[];
    }

    return [];
  }, [moviesResponse]);

  const getMovieImage = (movie: HomeMovie) => {
    if (movie.poster && movie.poster.trim().length > 0) return movie.poster;
    return fallbackPoster;
  };

  const trendingMovies = useMemo(() => {
    return [...normalizedMovies]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 8);
  }, [normalizedMovies]);

  const recentlyAddedMovies = useMemo(() => {
    return [...normalizedMovies]
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || a.releaseDate).getTime();
        const dateB = new Date(b.createdAt || b.releaseDate).getTime();
        return dateB - dateA;
      })
      .slice(0, 8);
  }, [normalizedMovies]);

  const bentoItems = useMemo(() => {
    return trendingMovies.slice(0, 4).map((movie, index) => {
      const id = movie._id || `${movie.title}-${index}`;
      const genres = getListLabels(movie.genres);

      return {
        id,
        title: movie.title,
        subtitle: index === 0 ? genres || movie.status : undefined,
        imageUrl: getMovieImage(movie),
        large: index === 0,
        buttonText: index === 0 ? 'Xem trailer' : undefined,
        onButtonClick:
          index === 0 && movie.trailer
            ? () => window.open(movie.trailer as string, '_blank')
            : undefined,
      };
    });
  }, [trendingMovies]);

  const heroMovie = trendingMovies[0] || normalizedMovies[0];

  const handlePlay = () => {
    if (!heroMovie) return;
    alert(`Đang mở phim: ${heroMovie.title}`);
  };

  const handleInfo = () => {
    if (!heroMovie) return;
    alert(`Thông tin phim: ${heroMovie.title}`);
  };

  return (
    <div className="w-full bg-slate-950">
      <HeroSection
        title={heroMovie?.title || 'MiCinema'}
        subtitle={getListLabels(heroMovie?.genres, 'Now Showing')}
        description={
          heroMovie?.description ||
          'Khám phá những bộ phim mới nhất đang được chiếu tại MiCinema.'
        }
        backgroundImage={heroMovie ? getMovieImage(heroMovie) : fallbackHero}
        releaseTag={heroMovie?.status || 'UPCOMING'}
        releaseDate={
          heroMovie
            ? `Khởi chiếu ${formatDate(heroMovie.releaseDate)}`
            : 'Sắp ra mắt'
        }
        onPlay={handlePlay}
        onInfo={handleInfo}
      />

      <main className="w-full relative z-10 space-y-0 pb-20">
        <HorizontalScrollSection title="Trending Now">
          {isLoading && (
            <p className="text-gray-400 px-1">Đang tải danh sách phim...</p>
          )}
          {isError && (
            <p className="text-red-400 px-1">
              Không tải được dữ liệu phim từ server.
            </p>
          )}

          {trendingMovies.map((movie) => (
            <TrendingCard
              key={movie._id || movie.title}
              id={movie._id || movie.title}
              title={movie.title}
              matchPercentage={Math.max(
                70,
                Math.min(99, Math.round(movie.rating * 10)),
              )}
              imageUrl={getMovieImage(movie)}
              rating={`${movie.rating.toFixed(1)}/10`}
              duration={formatDuration(movie.duration)}
              onClick={() => alert(`Opening: ${movie.title}`)}
            />
          ))}
        </HorizontalScrollSection>

        {bentoItems.length > 0 && (
          <BentoGrid title="Featured Picks" items={bentoItems} />
        )}

        <HorizontalScrollSection
          title="Recently Added"
          subtitle="Phim mới cập nhật từ hệ thống"
        >
          {recentlyAddedMovies.map((movie) => (
            <div
              key={movie._id || movie.title}
              className="flex-none w-40 sm:w-48 md:w-56 lg:w-64 aspect-[2/3] bg-slate-800 rounded-lg overflow-hidden group hover:shadow-xl transition-all hover:scale-105 duration-300 relative"
            >
              <img
                alt={movie.title}
                className="w-full h-full object-cover group-hover:opacity-70 transition-opacity"
                src={getMovieImage(movie)}
              />
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                <p className="text-sm font-semibold text-white truncate">
                  {movie.title}
                </p>
                <p className="text-xs text-gray-300">
                  {movie.status} • {formatDuration(movie.duration)} •{' '}
                  {formatDate(movie.releaseDate)}
                </p>
              </div>
            </div>
          ))}
        </HorizontalScrollSection>

        <section className="w-full bg-slate-950 px-6 md:px-12 lg:px-16 py-8 md:py-12">
          <div className="mb-6 md:mb-8">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                Movie Model Data
              </h2>
              <div className="w-12 h-0.5 bg-yellow-600"></div>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Hiển thị các trường chính từ model phim trên backend.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {normalizedMovies.map((movie) => (
              <article
                key={movie._id || movie.title}
                className="rounded-xl border border-white/10 bg-slate-900 p-4 md:p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-semibold text-white line-clamp-2">
                    {movie.title}
                  </h3>
                  <span className="shrink-0 rounded-md bg-yellow-600/90 text-black text-xs font-bold px-2 py-1">
                    {movie.status || 'N/A'}
                  </span>
                </div>

                <p className="text-sm text-gray-300 mt-2 line-clamp-3">
                  {movie.description || 'Chưa có mô tả'}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                  <p className="text-gray-400">Rating</p>
                  <p className="text-white text-right">
                    {movie.rating.toFixed(1)}/10
                  </p>

                  <p className="text-gray-400">Duration</p>
                  <p className="text-white text-right">
                    {formatDuration(movie.duration)}
                  </p>

                  <p className="text-gray-400">Release</p>
                  <p className="text-white text-right">
                    {movie.releaseDate ? formatDate(movie.releaseDate) : 'N/A'}
                  </p>

                  <p className="text-gray-400">Language</p>
                  <p className="text-white text-right">
                    {movie.language || 'N/A'}
                  </p>

                  <p className="text-gray-400">Audio</p>
                  <p className="text-white text-right">
                    {movie.audioType || 'N/A'}
                  </p>

                  <p className="text-gray-400">Age</p>
                  <p className="text-white text-right">
                    {movie.ageRating || 'N/A'}
                  </p>

                  <p className="text-gray-400">Country</p>
                  <p className="text-white text-right">
                    {movie.country || 'N/A'}
                  </p>

                  <p className="text-gray-400">Views</p>
                  <p className="text-white text-right">
                    {(movie.viewCount ?? 0).toLocaleString('vi-VN')}
                  </p>
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <p className="text-gray-400">
                    Directors:{' '}
                    <span className="text-gray-200">
                      {getListLabels(movie.directors)}
                    </span>
                  </p>
                  <p className="text-gray-400">
                    Actors:{' '}
                    <span className="text-gray-200">
                      {getListLabels(movie.actors)}
                    </span>
                  </p>
                  <p className="text-gray-400">
                    Genres:{' '}
                    <span className="text-gray-200">
                      {getListLabels(movie.genres)}
                    </span>
                  </p>
                </div>

                {movie.slug && (
                  <p className="mt-3 text-[11px] text-gray-500 truncate">
                    slug: {movie.slug}
                  </p>
                )}
              </article>
            ))}
          </div>

          {!isLoading && !isError && normalizedMovies.length === 0 && (
            <p className="text-gray-400">Chưa có phim nào để hiển thị.</p>
          )}
        </section>
      </main>
    </div>
  );
}
