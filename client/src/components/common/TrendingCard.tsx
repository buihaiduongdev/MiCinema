interface TrendingCardProps {
  id: string;
  title: string;
  matchPercentage: number;
  imageUrl: string;
  rating?: string;
  duration?: string;
  onClick?: () => void;
}

export default function TrendingCard({
  id,
  title,
  matchPercentage,
  imageUrl,
  rating = '16+',
  duration = '2h 14m',
  onClick,
}: TrendingCardProps) {
  return (
    <div
      key={id}
      className="flex-none w-40 sm:w-48 md:w-56 lg:w-64 aspect-[2/3] relative group rounded-xl overflow-hidden cursor-pointer transition-transform hover:scale-105 duration-300"
      onClick={onClick}
    >
      {/* Image */}
      <img
        alt={title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        src={imageUrl}
      />

      {/* Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <span className="text-xs font-bold text-yellow-500 mb-1">
          {matchPercentage}% Match
        </span>
        <h3 className="text-sm font-bold text-white leading-tight mb-3">
          {title}
        </h3>
        <div className="flex gap-2">
          <span className="text-[10px] border border-white/40 px-2 py-0.5 rounded text-gray-300">
            {rating}
          </span>
          <span className="text-[10px] text-gray-300">{duration}</span>
        </div>
      </div>
    </div>
  );
}
