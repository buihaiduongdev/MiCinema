/**
 * MovieDetail — Component chi tiết phim
 *
 * Sections:
 * 1. Banner (poster background + play trailer inline)
 * 2. Info (poster nhỏ + title + badges + rating + genres + directors + actors)
 * 3. Nội dung phim (description)
 * 4. Lịch chiếu (date tabs + cinema filter + showtime slots)
 * 5. Sidebar: Phim đang chiếu (related movies)
 */

import { useState } from 'react';
import { Badge, Container } from '@mantine/core';
import { Link } from 'react-router-dom';
import { getYouTubeEmbedUrl } from './TrailerModal';
import RatingModal from './RatingModal';
import type { MovieResponse } from '../services/movies.service';

// Màu sắc theo age rating
const AGE_RATING_COLORS: Record<string, { bg: string; text: string }> = {
  P: { bg: 'bg-green-500', text: 'Phổ biến' },
  C13: { bg: 'bg-yellow-500', text: 'C13' },
  C16: { bg: 'bg-orange-500', text: 'C16' },
  C18: { bg: 'bg-red-600', text: 'C18' },
};

interface MovieDetailProps {
  movie: MovieResponse;
}

export default function MovieDetail({ movie }: MovieDetailProps) {
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  const embedUrl = movie.trailer ? getYouTubeEmbedUrl(movie.trailer) : null;
  const ageRating = AGE_RATING_COLORS[movie.ageRating] || {
    bg: 'bg-gray-500',
    text: movie.ageRating,
  };

  const releaseDate = new Date(movie.releaseDate).toLocaleDateString('vi-VN');

  return (
    <div>
      {/* ========== BANNER SECTION ========== */}
      <div className="relative w-full h-[400px] md:h-[480px] overflow-hidden">
        {isPlayingTrailer && embedUrl ? (
          /* Trailer đang phát — YouTube embed inline */
          <div className="w-full h-full bg-black">
            <iframe
              className="w-full h-full"
              src={embedUrl}
              title={`Trailer ${movie.title}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: 'none' }}
            />
          </div>
        ) : (
          /* Banner poster với nút Play */
          <>
            {/* Background Image */}
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60" />

            {/* Play Button (center) */}
            {movie.trailer && (
              <button
                onClick={() => setIsPlayingTrailer(true)}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border-2 border-white/50 cursor-pointer group"
              >
                <svg
                  className="w-8 h-8 text-white ml-1 group-hover:scale-110 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.5 3.5a1 1 0 011.555-.832l10 6.5a1 1 0 010 1.664l-10 6.5A1 1 0 016.5 16.5v-13z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}

            {/* Movie Title on Banner */}
            <div className="absolute bottom-6 left-0 right-0">
              <Container size="xl">
                <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                  {movie.title}
                </h1>
              </Container>
            </div>
          </>
        )}
      </div>

      {/* ========== INFO SECTION ========== */}
      <Container size="xl" className="py-8">
        <div className="flex gap-8">
          {/* LEFT: Main Content */}
          <div className="flex-1 min-w-0">
            {/* Poster + Info Row */}
            <div className="flex gap-6 mb-8">
              {/* Poster nhỏ */}
              <div className="shrink-0 w-[200px] -mt-24 relative z-10">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full rounded-xl shadow-2xl border-4 border-white"
                />
              </div>

              {/* Info Details */}
              <div className="flex-1 pt-2">
                {/* Title + Age Rating */}
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {movie.title}
                  </h2>
                  <span
                    className={`${ageRating.bg} text-white text-xs font-bold px-2.5 py-1 rounded-md`}
                  >
                    {ageRating.text}
                  </span>
                </div>

                {/* Duration + Release Date */}
                <div className="flex items-center gap-4 text-gray-600 text-sm mb-3">
                  <span className="flex items-center gap-1">
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {movie.duration} Phút
                  </span>
                  <span className="flex items-center gap-1">
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {releaseDate}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-yellow-400 fill-yellow-400"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-lg font-bold text-gray-900">
                      {movie.rating.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-500 mr-2">
                      ({movie.viewCount} votes)
                    </span>

                    <button
                      onClick={() => setIsRatingModalOpen(true)}
                      className="text-xs bg-orange-100 text-orange-600 hover:bg-orange-200 border border-orange-200 font-semibold py-1 px-3 rounded shadow-sm transition-colors uppercase tracking-wide cursor-pointer flex items-center gap-1"
                    >
                      <span>★</span> Đánh giá
                    </button>
                  </div>
                </div>

                <RatingModal
                  opened={isRatingModalOpen}
                  onClose={() => setIsRatingModalOpen(false)}
                  movieTitle={movie.title}
                  movieRating={movie.rating}
                />

                {/* Country */}
                {movie.country && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <span className="text-gray-400 min-w-[80px]">
                      Quốc gia:
                    </span>
                    <span>{movie.country}</span>
                  </div>
                )}

                {/* Language */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <span className="text-gray-400 min-w-[80px]">Ngôn ngữ:</span>
                  <span>
                    {movie.language}{' '}
                    {movie.audioType === 'DUBBED' ? '(Lồng tiếng)' : '(Phụ đề)'}
                  </span>
                </div>

                {/* Genres */}
                <div className="flex items-center gap-2 text-sm mb-2">
                  <span className="text-gray-400 min-w-[80px]">Thể loại:</span>
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                      <Link
                        to={`/dien-anh?genre=${genre._id}`}
                        key={genre._id}
                        className="no-underline"
                      >
                        <Badge
                          variant="outline"
                          color="gray"
                          size="sm"
                          radius="sm"
                          className="hover:bg-gray-100 cursor-pointer"
                        >
                          {genre.name}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Directors */}
                {movie.directors.length > 0 && (
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <span className="text-gray-400 min-w-[80px]">
                      Đạo diễn:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {movie.directors.map((d) => (
                        <Link
                          to={`/dao-dien/${d.slug}`}
                          key={d._id}
                          className="no-underline"
                        >
                          <Badge
                            variant="light"
                            color="blue"
                            size="sm"
                            radius="sm"
                            className="hover:bg-blue-100 cursor-pointer"
                          >
                            {d.name}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actors */}
                {movie.actors.length > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400 min-w-[80px]">
                      Diễn viên:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {movie.actors.map((a) => (
                        <Link
                          to={`/dien-vien/${a.slug}`}
                          key={a._id}
                          className="no-underline"
                        >
                          <Badge
                            variant="light"
                            color="blue"
                            size="sm"
                            radius="sm"
                            className="hover:bg-blue-100 cursor-pointer"
                          >
                            {a.name}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ========== NỘI DUNG PHIM ========== */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-3 pb-2 border-b-2 border-orange-500 inline-block">
                Nội Dung Phim
              </h3>
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {movie.description}
              </div>
            </div>
          </div>

          {/* RIGHT: Sidebar — sẽ được truyền từ ngoài */}
        </div>
      </Container>
    </div>
  );
}
