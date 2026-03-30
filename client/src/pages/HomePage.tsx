import { useEffect, useMemo, useState } from 'react';
import HeroSection from '@/components/common/HeroSection';
import TrendingCard from '@/components/common/TrendingCard';
import HorizontalScrollSection from '@/components/common/HorizontalScrollSection';
import BentoGrid from '@/components/common/BentoGrid';
import { useMovies } from '@/features/movies/hooks/useMovies';
import type { MovieResponse } from '@/features/movies/services/movies.service';
import { formatDate, formatDuration } from '@/utils/format';
import { useNavigate } from 'react-router-dom';
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

type ImageVariant = 'hero' | 'poster' | 'thumb';

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

const optimizeImageUrl = (url: string, variant: ImageVariant): string => {
  let optimized = url.trim();

  // TMDB: đổi size nhỏ (w500) lên size lớn hơn cho Hero để hạn chế vỡ ảnh.
  if (optimized.includes('image.tmdb.org/t/p/')) {
    if (variant === 'hero') {
      return optimized.replace(/\/w\d+\//, '/original/');
    }

    if (variant === 'thumb') {
      return optimized.replace(/\/w\d+\//, '/w342/');
    }

    return optimized.replace(/\/w\d+\//, '/w780/');
  }

  return optimized;
};

export default function HomePage() {
  const fallbackPoster =
    'https://images.unsplash.com/photo-1489599856769-c5ae6f84f5a7?w=800&h=1200&fit=crop';
  const fallbackHero =
    'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=1920&h=1080&fit=crop';
  const navigate = useNavigate();
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

  const getMovieImage = (
    movie: HomeMovie,
    variant: ImageVariant = 'poster',
  ) => {
    if (movie.poster && movie.poster.trim().length > 0) {
      return optimizeImageUrl(movie.poster, variant);
    }

    if (variant === 'hero') return fallbackHero;
    return fallbackPoster;
  };

  const trendingMovies = useMemo(() => {
    return [...normalizedMovies]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 8);
  }, [normalizedMovies]);

  const heroCandidates = useMemo(() => {
    return [...normalizedMovies]
      .filter(
        (movie) => movie.status === 'RELEASED' || movie.status === 'UPCOMING',
      )
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 8);
  }, [normalizedMovies]);

  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  useEffect(() => {
    setActiveHeroIndex(0);
  }, [heroCandidates.length]);

  useEffect(() => {
    if (heroCandidates.length <= 1) return;

    const intervalId = window.setInterval(() => {
      setActiveHeroIndex(
        (currentIndex) => (currentIndex + 1) % heroCandidates.length,
      );
    }, 10000);

    return () => window.clearInterval(intervalId);
  }, [heroCandidates.length]);

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
            ? (e) => {
                e.stopPropagation();
                window.open(movie.trailer as string, '_blank');
              }
            : undefined,
        onClick: () => navigate(`/phim/${movie.slug}`),
      };
    });
  }, [trendingMovies, navigate]);

  const heroMovie =
    heroCandidates[activeHeroIndex] || trendingMovies[0] || normalizedMovies[0];

  const handlePlay = () => {
    if (!heroMovie) return;
    navigate(`/phim/${heroMovie.slug}`);
  };

  const handleInfo = () => {
    if (!heroMovie) return;
    navigate(`/phim/${heroMovie.slug}`);
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
        backgroundImage={
          heroMovie ? getMovieImage(heroMovie, 'hero') : fallbackHero
        }
        releaseTag={heroMovie?.status || 'UPCOMING'}
        releaseDate={
          heroMovie
            ? `Khởi chiếu ${formatDate(heroMovie.releaseDate)}`
            : 'Sắp ra mắt'
        }
        onPlay={handlePlay}
        onInfo={handleInfo}
      />

      {heroCandidates.length > 1 && (
        <section className="relative z-20 -mt-20 px-6 md:px-12 lg:px-16">
          <div className="ml-auto w-fit max-w-full">
            <div className="flex items-center gap-3 overflow-x-auto overflow-y-hidden pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {heroCandidates.map((movie, index) => {
                const isActive = index === activeHeroIndex;
                return (
                  <button
                    key={movie._id || `${movie.title}-${index}`}
                    type="button"
                    onClick={() => setActiveHeroIndex(index)}
                    className={`group relative flex-none w-24 sm:w-28 md:w-32 aspect-[16/9] rounded-lg overflow-hidden border transition-all duration-300 ${
                      isActive
                        ? 'border-yellow-500 shadow-[0_0_0_2px_rgba(234,179,8,0.35)]'
                        : 'border-white/20 opacity-80 hover:opacity-100 hover:border-white/50'
                    }`}
                    aria-label={`Chọn phim ${movie.title}`}
                  >
                    <img
                      alt={movie.title}
                      src={getMovieImage(movie, 'thumb')}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <span className="absolute left-2 bottom-1 text-[10px] md:text-[11px] text-white font-medium truncate max-w-[85%]">
                      {movie.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

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
              onClick={() => navigate(`/phim/${movie.slug}`)}
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
              onClick={() => navigate(`/phim/${movie.slug}`)}
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
      </main>
    </div>
  );
}
