import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { MediaFallback } from '@/components/common/MediaFallback';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';

interface VideoPlayerProps {
  src: string;
  label: string;
  className?: string;
  autoplayWhenVisible?: boolean;
  loop?: boolean;
}

export function VideoPlayer({
  src,
  label,
  className,
  autoplayWhenVisible = true,
  loop = true,
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [needsManualPlay, setNeedsManualPlay] = useState(false);

  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
    setIsPlaying(false);
    setNeedsManualPlay(false);
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container || !autoplayWhenVisible || hasError) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting) {
          if (prefersReducedMotion) {
            setNeedsManualPlay(true);
            return;
          }
          video
            .play()
            .then(() => {
              setNeedsManualPlay(false);
            })
            .catch(() => {
              setNeedsManualPlay(true);
            });
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(container);
    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [autoplayWhenVisible, hasError, prefersReducedMotion]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video
        .play()
        .then(() => setNeedsManualPlay(false))
        .catch(() => setNeedsManualPlay(true));
    } else {
      video.pause();
    }
  };

  if (hasError || !src) {
    return (
      <MediaFallback
        type="video"
        title="About Video Unavailable"
        description="The video could not be loaded. It can be uploaded or replaced from the Admin Dashboard."
        className={cn('aspect-video w-full', className)}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'group relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-obsidian-950 shadow-cinematic',
        className
      )}
    >
      {!isLoaded && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-obsidian-900"
          aria-hidden="true"
        >
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/15 border-t-ember-400" />
        </div>
      )}

      <video
        ref={videoRef}
        src={src}
        muted
        loop={loop}
        playsInline
        preload="metadata"
        aria-label={label}
        onLoadedData={() => setIsLoaded(true)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => setHasError(true)}
        className="h-full w-full bg-obsidian-950 object-contain"
      />

      {/* Accessible play/pause control shown when reduced-motion/autoplay blocked or hovered */}
      <button
        type="button"
        onClick={togglePlayback}
        aria-label={isPlaying ? `Pause ${label}` : `Play ${label}`}
        className={cn(
          'absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-obsidian-950/75 text-smoke-100 backdrop-blur-md transition-opacity duration-200 hover:border-ember-400/60 hover:text-ember-300',
          needsManualPlay || !isPlaying
            ? 'opacity-100'
            : 'opacity-0 focus-visible:opacity-100 group-hover:opacity-100'
        )}
      >
        {isPlaying ? (
          <Pause className="h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <Play className="h-3.5 w-3.5 translate-x-[1px]" aria-hidden="true" />
        )}
      </button>

      <div
        className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10"
        aria-hidden="true"
      />
    </div>
  );
}
