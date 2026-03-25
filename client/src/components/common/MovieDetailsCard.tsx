interface MovieDetailsCardProps {
  title: string;
  releaseYear: number;
  duration: string;
  director: string;
  cast: string[];
  description: string;
  language: string;
  onBook?: () => void;
}

export default function MovieDetailsCard({
  title,
  releaseYear,
  duration,
  director,
  cast,
  description,
  language,
  onBook,
}: MovieDetailsCardProps) {
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 text-white">
      {/* Title */}
      <h2 className="text-2xl font-bold mb-4 text-yellow-400">{title}</h2>

      {/* Key Details */}
      <div className="space-y-3 mb-6 pb-6 border-b border-slate-700">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Năm phát hành:</span>
          <span className="font-semibold">{releaseYear}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Thời lượng:</span>
          <span className="font-semibold">{duration}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Ngôn ngữ:</span>
          <span className="font-semibold">{language}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Đạo diễn:</span>
          <span className="font-semibold text-right">{director}</span>
        </div>
      </div>

      {/* Cast */}
      <div className="mb-6 pb-6 border-b border-slate-700">
        <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase">Diễn viên:</h3>
        <div className="flex flex-wrap gap-2">
          {cast.map((actor, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-slate-700 rounded-full text-sm text-gray-300 hover:bg-slate-600 transition-colors cursor-pointer"
            >
              {actor}
            </span>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase">Mô tả:</h3>
        <p className="text-sm text-gray-300 leading-relaxed line-clamp-4">
          {description}
        </p>
      </div>

      {onBook && (
        <div className="mt-8 pt-6 border-t border-slate-700">
          <button
            type="button"
            onClick={onBook}
            className="w-full rounded-full bg-yellow-500 py-3 text-center text-base font-bold text-black transition hover:bg-yellow-400 sm:w-auto sm:px-10"
          >
            Đặt vé xem phim
          </button>
        </div>
      )}
    </div>
  );
}
