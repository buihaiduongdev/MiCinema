import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroBanner from '@/components/common/HeroBanner';
import MovieImageCarousel from '@/components/common/MovieImageCarousel';
import MovieDetailsCard from '@/components/common/MovieDetailsCard';
import MovieCard from '@/components/common/MovieCard';
import { HomeRoomsSection } from '@/components/home/HomeRoomsSection';
import { bookingPath, hasDefaultShowtime, DEFAULT_SHOWTIME_ID } from '@/constants/booking';

interface Genre {
  id: string;
  name: string;
}

interface MovieImage {
  id: string;
  url: string;
  alt: string;
}

interface FeaturedMovie {
  id: string;
  title: string;
  backgroundImage: string;
  genres: Genre[];
  rating: number;
  releaseYear: number;
  duration: string;
  director: string;
  cast: string[];
  description: string;
  language: string;
  images: MovieImage[];
}

interface HighlightMovie {
  id: string;
  title: string;
  rating: number;
  thumbnailUrl?: string;
}

export default function HomePage() {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);

  /** Nội dung marketing — thay bằng API phim khi sẵn sàng */
  const featuredMovie: FeaturedMovie = {
    id: '1',
    title: 'Truc Ngoc',
    backgroundImage: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=1200&h=600&fit=crop',
    genres: [
      { id: '1', name: 'Cổ Trang' },
      { id: '2', name: 'Tâm Lý' },
      { id: '3', name: 'Chiến Kích' },
    ],
    rating: 8.0,
    releaseYear: 2024,
    duration: '2h 15m',
    director: 'Zhu Yu',
    cast: ['Nữ diễn viên 1', 'Nam diễn viên 1', 'Diễn viên 2'],
    description:
      'Bo phim kể về cô nàng bận rộn làm Phán Truân Ngộc, người có cuộc sống bị gì định mệnh với hàng giấu mai..' +
      'Tạc Ta Chính trong một đêm tuyết rơi, một người mà đẹp lạ lùng rồi chia lìa. Một người đó vàng mai ' +
      'hiến đó một nhân vật giáo mai danh dự lịch đề tra một huyền thì 17 năm...',
    language: 'Tiếng Trung Quốc',
    images: [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=500&fit=crop',
        alt: 'Poster 1',
      },
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1495599810694-2c8f2b8d0101?w=400&h=500&fit=crop',
        alt: 'Poster 2',
      },
      {
        id: '3',
        url: 'https://images.unsplash.com/photo-1489749798305-4fea3ba63d60?w=400&h=500&fit=crop',
        alt: 'Poster 3',
      },
      {
        id: '4',
        url: 'https://images.unsplash.com/photo-1524712245610-fc4bd5b7ab4d?w=400&h=500&fit=crop',
        alt: 'Poster 4',
      },
      {
        id: '5',
        url: 'https://images.unsplash.com/photo-1533613220915-121e63e606fa?w=400&h=500&fit=crop',
        alt: 'Poster 5',
      },
    ],
  };

  const highlightMovies: HighlightMovie[] = [
    {
      id: 'hm-1',
      title: 'Thien Menh',
      rating: 8.1,
      thumbnailUrl: 'https://images.unsplash.com/photo-1489599856769-c5ae6f84f5a7?w=400&h=225&fit=crop',
    },
    {
      id: 'hm-2',
      title: 'Kiem Vu',
      rating: 8.4,
      thumbnailUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=225&fit=crop',
    },
    {
      id: 'hm-3',
      title: 'Mong Dao',
      rating: 8.3,
      thumbnailUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=225&fit=crop',
    },
    {
      id: 'hm-4',
      title: 'Tinh Hai',
      rating: 8.6,
      thumbnailUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&h=225&fit=crop',
    },
    {
      id: 'hm-5',
      title: 'Lam Hoa',
      rating: 8.2,
      thumbnailUrl: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&h=225&fit=crop',
    },
    {
      id: 'hm-6',
      title: 'Truong Sinh',
      rating: 8.5,
      thumbnailUrl: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=400&h=225&fit=crop',
    },
    {
      id: 'hm-7',
      title: 'Bach Van',
      rating: 8.0,
      thumbnailUrl: 'https://images.unsplash.com/photo-1505685296765-3a2736de412f?w=400&h=225&fit=crop',
    },
    {
      id: 'hm-8',
      title: 'Phong Am',
      rating: 8.7,
      thumbnailUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=225&fit=crop',
    },
  ];

  const goToBookingFlow = () => {
    if (hasDefaultShowtime()) {
      navigate(bookingPath(DEFAULT_SHOWTIME_ID));
      return;
    }
    navigate('/schedule');
  };

  const handlePlay = () => {
    goToBookingFlow();
  };

  const handleInfo = () => {
    document.getElementById('phim-chi-tiet')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  return (
    <>
      {/* Hero Banner Section */}
      <section className="relative w-full">
        <HeroBanner
          backgroundImage={featuredMovie.backgroundImage}
          movieTitle={featuredMovie.title}
          genres={featuredMovie.genres}
          rating={featuredMovie.rating}
          description={featuredMovie.description}
          onPlay={handlePlay}
          onInfo={handleInfo}
          onWishlist={handleWishlist}
          isWishlisted={isWishlisted}
          fullScreen={true}
        />
      </section>

      {/* Content Sections - Outside of fullscreen banner */}
      <div className="w-full bg-gradient-to-b from-slate-950 to-slate-900">
        {/* Details Section */}
        <section
          id="phim-chi-tiet"
          className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 scroll-mt-24"
        >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Movie Carousel */}
          <div className="lg:col-span-1">
            <MovieImageCarousel images={featuredMovie.images} />
          </div>

          {/* Right: Movie Details */}
          <div className="lg:col-span-2">
            <MovieDetailsCard
              title={featuredMovie.title}
              releaseYear={featuredMovie.releaseYear}
              duration={featuredMovie.duration}
              director={featuredMovie.director}
              cast={featuredMovie.cast}
              description={featuredMovie.description}
              language={featuredMovie.language}
              onBook={goToBookingFlow}
            />
          </div>
        </div>
      </section>

      <HomeRoomsSection />

      {/* More Movies Section (tùy chọn) */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-white mb-2">Phim nổi bật khác</h2>
        <p className="mb-8 text-sm text-slate-400">
          Chọn phim để mở luồng đặt vé (suất lấy từ cấu hình hoặc trang lịch chiếu).
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {highlightMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              title={movie.title}
              rating={movie.rating}
              thumbnailUrl={movie.thumbnailUrl}
              onClick={goToBookingFlow}
            />
          ))}
        </div>
      </section>
      </div>
    </>
  );
}
