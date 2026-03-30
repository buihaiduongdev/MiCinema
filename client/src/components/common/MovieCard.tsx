/**
 * MovieCard — Card hiển thị phim với hover overlay
 *
 * Props: { movie, onClick? }
 * Hover: overlay với 2 nút "Mua vé" + "Trailer"
 * Click ngoài 2 nút → vào chi tiết phim
 * Click "Trailer" → mở modal YouTube embed (không redirect)
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TrailerModal from '../../features/movies/components/TrailerModal';
import type { MovieResponse } from '../../features/movies/services/movies.service';

// Màu sắc theo age rating
const AGE_RATING_COLORS: Record<string, string> = {
  P: 'bg-green-500',
  C13: 'bg-yellow-500',
  C16: 'bg-orange-500',
  C18: 'bg-red-600',
};

interface MovieCardProps {
  movie: MovieResponse;
  onBuyTicket?: (movie: MovieResponse) => void;
}

export default function MovieCard({ movie, onBuyTicket }: MovieCardProps) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [trailerOpened, setTrailerOpened] = useState(false);

  const handleCardClick = () => {
    navigate(`/phim/${movie.slug}`);
  };

  const handleBuyTicket = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBuyTicket) {
      onBuyTicket(movie);
    } else {
      navigate(`/phim/${movie.slug}`);
    }
  };

  const handleTrailer = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (movie.trailer) {
      setTrailerOpened(true);
    }
  };

  return (
    <>
      <div className="group cursor-pointer" onClick={handleCardClick}>
        {/* Poster Container */}
        <div
          className="relative overflow-hidden rounded-xl aspect-[2/3]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Poster Image */}
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />

          {/* Rating Badge — góc phải trên */}
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1">
            <svg
              className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-white text-sm font-bold">
              {movie.rating.toFixed(1)}
            </span>
          </div>

          {/* Age Rating Badge — góc phải dưới */}
          <div
            className={`absolute bottom-2 right-2 ${AGE_RATING_COLORS[movie.ageRating] || 'bg-gray-500'} text-white text-xs font-bold px-2 py-1 rounded-md`}
          >
            {movie.ageRating}
          </div>

          {/* HOVER OVERLAY — 2 nút Mua vé + Trailer */}
          <div
            className={`absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-3 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Nút Mua vé */}
            <button
              onClick={handleBuyTicket}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-full transition-all duration-200 hover:scale-105 shadow-lg cursor-pointer"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                />
              </svg>
              Mua vé
            </button>

            {/* Nút Trailer */}
            {movie.trailer && (
              <button
                onClick={handleTrailer}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold px-6 py-2.5 rounded-full transition-all duration-200 hover:scale-105 border border-white/40 cursor-pointer"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
                Trailer
              </button>
            )}
          </div>
        </div>

        {/* Movie Title */}
        <h3 className="mt-3 text-[15px] font-semibold text-gray-900 leading-tight line-clamp-2 group-hover:text-orange-500 transition-colors duration-200">
          {movie.title}
        </h3>
      </div>

      {/* Trailer Modal — YouTube embed inline */}
      {movie.trailer && (
        <TrailerModal
          opened={trailerOpened}
          onClose={() => setTrailerOpened(false)}
          trailerUrl={movie.trailer}
          movieTitle={movie.title}
        />
      )}
    </>
  );
}
