import { Play, Info } from 'lucide-react';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description: string;
  backgroundImage: string;
  releaseTag?: string;
  releaseDate?: string;
  onPlay?: () => void;
  onInfo?: () => void;
}

export default function HeroSection({
  title,
  subtitle,
  description,
  backgroundImage,
  releaseTag = 'New Release',
  releaseDate = 'Released Today',
  onPlay,
  onInfo,
}: HeroSectionProps) {
  return (
    <header className="relative w-full h-[500px] md:h-[650px] overflow-hidden">
      {/* Hero Background with Overlays */}
      <div className="absolute inset-0 -z-10 w-full h-full">
        <img
          alt="Hero Background"
          className="w-full h-full object-cover"
          src={backgroundImage}
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-transparent"></div>
      </div>

      {/* Hero Content Container */}
      <div className="relative w-full h-full flex items-end">
        <div className="w-full px-6 md:px-12 lg:px-16 pb-12 md:pb-20">
          <div className="max-w-3xl space-y-6">
            {/* Tags */}
            <div className="flex items-center gap-3">
              <span className="bg-yellow-600 text-black px-3 py-1 text-xs font-bold tracking-widest uppercase rounded-sm">
                {releaseTag}
              </span>
              <span className="text-gray-400 text-sm font-medium tracking-wide">
                {releaseDate}
              </span>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none text-white drop-shadow-2xl">
                {title}
              </h1>
              {subtitle && (
                <p className="text-3xl md:text-5xl font-black text-yellow-500 mt-2 drop-shadow-lg">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Description */}
            <p className="text-base md:text-lg text-gray-300 leading-relaxed max-w-2xl drop-shadow-md">
              {description}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-4">
              <button
                onClick={onPlay}
                className="bg-white text-black px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-white/90 transition-all scale-100 hover:scale-105 active:scale-95 duration-200 shadow-lg"
              >
                <Play className="w-5 h-5 fill-current" />
                Play Now
              </button>

              <button
                onClick={onInfo}
                className="bg-slate-700/60 backdrop-blur-md text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-700 transition-all scale-100 hover:scale-105 active:scale-95 duration-200"
              >
                <Info className="w-5 h-5" />
                More Info
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
