import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

type Props = {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: ReactNode;
  variant?: 'default' | 'warning' | 'error';
};

const ring: Record<NonNullable<Props['variant']>, string> = {
  default: 'bg-yellow-500/15 text-yellow-400',
  warning: 'bg-amber-500/15 text-amber-300',
  error: 'bg-red-500/15 text-red-300',
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  children,
  variant = 'default',
}: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-8 text-center shadow-xl backdrop-blur-sm md:p-10">
      <div
        className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${ring[variant]}`}
      >
        <Icon className="h-7 w-7" strokeWidth={1.5} />
      </div>
      <h2 className="text-lg font-semibold text-white md:text-xl">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-400 md:text-base">{description}</p>
      {children ? <div className="mt-6 w-full">{children}</div> : null}
    </div>
  );
}
