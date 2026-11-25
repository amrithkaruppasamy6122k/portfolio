import { cn } from '@/lib/cn';

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'mb-10 sm:mb-14',
        align === 'center' && 'mx-auto max-w-2xl text-center',
        className
      )}
    >
      <div
        className={cn(
          'mb-3 inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.26em] text-ember-400',
          align === 'center' && 'justify-center'
        )}
      >
        <span className="h-[1px] w-6 bg-ember-500/70" aria-hidden="true" />
        <span>{eyebrow}</span>
      </div>
      <h2 className="font-display text-4xl font-bold uppercase tracking-wide text-smoke-50 sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-smoke-300 sm:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}
