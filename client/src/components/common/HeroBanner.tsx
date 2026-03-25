import { Heart, Info, Play } from 'lucide-react';

interface HeroBannerProps {
  backgroundImage: string;
  movieTitle: string;
  genres: { id: string; name: string }[];
  rating: number;
  description?: string;
  /** Nút chính — mặc định gắn luồng đặt vé */
  primaryActionLabel?: string;
  onPlay?: () => void;
  onInfo?: () => void;
  onWishlist?: () => void;
  isWishlisted?: boolean;
  fullScreen?: boolean;
}

export default function HeroBanner({
  backgroundImage,
  movieTitle,
  genres,
  rating,
  description,
  primaryActionLabel = 'Đặt vé',
  onPlay,
  onInfo,
  onWishlist,
  isWishlisted = false,
  fullScreen = false,
}: HeroBannerProps) {
  return (
    <div className={`relative overflow-hidden w-full ${fullScreen ? 'h-screen' : 'h-96 md:h-[500px] lg:h-[600px]'}`}>
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center px-6 md:px-12 lg:px-20">
        <div className="max-w-md">
          {/* Movie Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            {movieTitle}
          </h1>

          {/* Genres and Rating */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex gap-2">
              {genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-yellow-500 text-black text-sm font-semibold rounded"
                >
                  {genre.name}
                </span>
              ))}
            </div>
            <span className="text-yellow-400 font-bold text-lg">
              ⭐ {rating.toFixed(1)}
            </span>
          </div>

          {/* Description */}
          {description && (
            <p className="text-gray-200 text-sm md:text-base leading-relaxed mb-8 hidden sm:block">
              {description}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onPlay}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all transform hover:scale-105"
            >
              <Play className="w-5 h-5 fill-current" />
              {primaryActionLabel}
            </button>

            <button
              type="button"
              onClick={onInfo}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all"
              title="Xem giới thiệu phim bên dưới"
            >
              <Info className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={onWishlist}
              className={`px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all ${
                isWishlisted
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-600 text-white hover:bg-red-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
