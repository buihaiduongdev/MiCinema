import type { ReactNode } from 'react';

interface HorizontalScrollSectionProps {
  title: string;
  children: ReactNode;
  subtitle?: string;
}

export default function HorizontalScrollSection({
  title,
  children,
  subtitle,
}: HorizontalScrollSectionProps) {
  return (
    <section className="w-full bg-slate-950 overflow-hidden">
      {/* Title Section fluid width */}
      <div className="w-full px-6 md:px-12 lg:px-16 py-8 md:py-12 pb-0 md:pb-6">
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              {title}
            </h2>
            <div className="w-12 h-0.5 bg-yellow-600"></div>
          </div>
          {subtitle && <p className="text-sm text-gray-400 mt-2">{subtitle}</p>}
        </div>
      </div>

      {/* Scrollable Container - Full Width */}
      <div className="w-full overflow-x-auto overflow-y-hidden hide-scrollbar">
        <div className="inline-flex w-full gap-4 px-6 md:px-12 lg:px-16 pb-6">
          {children}
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
