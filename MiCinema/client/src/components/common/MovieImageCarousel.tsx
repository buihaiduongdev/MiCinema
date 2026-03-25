import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MovieImage {
  id: string;
  url: string;
  alt?: string;
}

interface MovieImageCarouselProps {
  images: MovieImage[];
  onImageClick?: (image: MovieImage) => void;
}

export default function MovieImageCarousel({
  images,
  onImageClick,
}: MovieImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (!autoScroll || images.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [autoScroll, images.length]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setAutoScroll(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setAutoScroll(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setAutoScroll(false);
  };

  if (images.length === 0) {
    return <div className="bg-gray-800 h-40 rounded-lg" />;
  }

  return (
    <div className="w-full">
      {/* Main Image */}
      <div className="relative h-40 md:h-48 rounded-lg overflow-hidden bg-gray-900">
        <img
          src={images[currentIndex].url}
          alt={images[currentIndex].alt || 'Movie image'}
          className="w-full h-full object-cover"
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              onMouseEnter={() => setAutoScroll(false)}
              onMouseLeave={() => setAutoScroll(true)}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition-all z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={goToNext}
              onMouseEnter={() => setAutoScroll(false)}
              onMouseLeave={() => setAutoScroll(true)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition-all z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Row */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => {
                goToSlide(index);
                onImageClick?.(image);
              }}
              className={`flex-shrink-0 w-16 h-20 md:w-20 md:h-24 rounded-lg overflow-hidden transition-all ${
                index === currentIndex
                  ? 'ring-2 ring-yellow-500 opacity-100'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={image.url}
                alt={image.alt || 'Thumbnail'}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Indicator Dots */}
      {images.length > 1 && (
        <div className="flex gap-2 justify-center mt-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-yellow-500 w-6' : 'bg-gray-500'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
