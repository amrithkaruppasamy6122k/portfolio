import { Film, ImageOff } from 'lucide-react';
import { cn } from '@/lib/cn';

interface MediaFallbackProps {
  type: 'video' | 'image';
  title: string;
  description: string;
  className?: string;
}

export function MediaFallback({
  type,
  title,
  description,
  className,
}: MediaFallbackProps) {
  const Icon = type === 'video' ? Film : ImageOff;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-obsidian-850/90 p-8 text-center',
        className
      )}
      role="status"
      aria-label={title}
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-ember-500/30 bg-ember-500/10 text-ember-400">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <p className="font-display text-xl font-semibold uppercase tracking-wide text-smoke-50">
        {title}
      </p>
      <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-smoke-300">
        {description}
      </p>
    </div>
  );
}
