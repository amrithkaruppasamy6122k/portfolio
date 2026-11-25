import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface IntroExperienceProps {
  videoSrc: string;
  isOpen: boolean;
  onComplete: () => void;
}

export function IntroExperience({
  videoSrc,
  isOpen,
  onComplete,
}: IntroExperienceProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  const finishIntro = useCallback(() => {
    const video = videoRef.current;
    if (video && !video.paused) {
      video.pause();
    }
    onComplete();
  }, [onComplete]);

  // Lock body scroll while intro overlay is active
  useEffect(() => {
    if (!isOpen || prefersReducedMotion) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        finishIntro();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, prefersReducedMotion, finishIntro]);

  useEffect(() => {
    if (!isOpen) return;

    if (prefersReducedMotion || !videoSrc) {
      finishIntro();
      return;
    }

    setIsVideoReady(false);
    setAutoplayBlocked(false);

    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        setAutoplayBlocked(true);
      });
    }
  }, [isOpen, prefersReducedMotion, videoSrc, finishIntro]);

  useEffect(() => {
    if (!autoplayBlocked || !isOpen) return;
    // Gracefully transition to Home if browser blocks autoplay so the site is never stuck.
    const timeoutId = window.setTimeout(() => {
      finishIntro();
    }, 900);
    return () => window.clearTimeout(timeoutId);
  }, [autoplayBlocked, isOpen, finishIntro]);

  // Fallback timeout in case slow network prevents video readiness indefinitely
  useEffect(() => {
    if (!isOpen || isVideoReady || prefersReducedMotion) return;
    const stallGuard = window.setTimeout(() => {
      finishIntro();
    }, 8000);
    return () => window.clearTimeout(stallGuard);
  }, [isOpen, isVideoReady, prefersReducedMotion, finishIntro]);

  return (
    <AnimatePresence>
      {isOpen && !prefersReducedMotion && (
        <motion.div
          key="intro-experience"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(6px)' }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian-950"
          role="dialog"
          aria-modal="true"
          aria-label="Portfolio intro experience"
        >
          {!isVideoReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-obsidian-950">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-ember-500" />
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-smoke-300">
                Entering Portfolio
              </p>
            </div>
          )}

          <video
            ref={videoRef}
            src={videoSrc}
            autoPlay
            muted
            playsInline
            preload="auto"
            onCanPlay={() => setIsVideoReady(true)}
            onEnded={finishIntro}
            onError={finishIntro}
            className="h-full w-full object-cover"
          />

          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-obsidian-950/90 via-obsidian-950/40 to-transparent"
            aria-hidden="true"
          />

          <button
            type="button"
            onClick={finishIntro}
            className="group absolute bottom-7 right-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-obsidian-900/75 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-smoke-100 backdrop-blur-md transition-all hover:border-ember-400/60 hover:bg-obsidian-800 hover:text-smoke-50 sm:bottom-10 sm:right-10"
          >
            <span>Skip Intro</span>
            <ArrowRight
              className="h-3.5 w-3.5 text-ember-400 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
