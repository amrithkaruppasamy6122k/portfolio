import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowDown,
  Download,
  FileWarning,
  PhoneCall,
  Play,
  Sparkles,
} from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useMediaAvailability } from '@/hooks/useMediaAvailability';
import { scrollToSection } from '@/lib/utils';
import { SECTION_IDS } from '@/config/theme.config';
import type { HeroContent } from '@/types/portfolio';

interface HeroSectionProps {
  content: HeroContent;
  resumeUrl: string;
  onReplayIntro: () => void;
}

export function HeroSection({
  content,
  resumeUrl,
  onReplayIntro,
}: HeroSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const { available: isResumeAvailable } = useMediaAvailability(resumeUrl);
  const [showResumeNotice, setShowResumeNotice] = useState(false);
  const [isPhoneRinging, setIsPhoneRinging] = useState(false);

  const handleDownloadClick = () => {
    if (!isResumeAvailable) {
      setShowResumeNotice(true);
      return;
    }
    setShowResumeNotice(false);
  };

  return (
    <section
      id={SECTION_IDS.HOME}
      className="relative flex min-h-screen scroll-mt-20 flex-col justify-center px-5 pb-24 pt-28 sm:scroll-mt-24 sm:px-8 lg:px-12"
    >
      <div className="mx-auto w-full max-w-6xl">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          {/* Identity badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-ember-500/30 bg-obsidian-900/75 px-3.5 py-1.5 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-ember-400" aria-hidden="true" />
            <span className="font-mono text-xs tracking-wider text-smoke-100">
              {content.identityTag}
            </span>
          </div>

          <p className="font-mono text-sm uppercase tracking-[0.26em] text-smoke-300 sm:text-base">
            {content.greeting}
          </p>

          <h1 className="mt-2 font-display text-7xl font-extrabold uppercase leading-[0.88] tracking-tight text-ember-gradient sm:text-8xl md:text-9xl">
            {content.name}
          </h1>

          <p className="mt-4 font-display text-2xl font-semibold uppercase tracking-[0.14em] text-smoke-100 sm:text-3xl">
            {content.title}
          </p>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-smoke-200 sm:text-lg">
            {content.description}
          </p>

          {/* CTA Buttons */}
          <div className="mt-9 flex flex-wrap items-center gap-4">
            {isResumeAvailable ? (
              <a
                href={resumeUrl}
                download="Amrith_Resume.pdf"
                className="group inline-flex items-center gap-2.5 rounded-full bg-ember-500 px-6 py-3.5 text-sm font-semibold text-obsidian-950 shadow-ember transition-all hover:bg-ember-400 active:scale-[0.98]"
              >
                <Download
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
                  aria-hidden="true"
                />
                <span>Download CV</span>
              </a>
            ) : (
              <button
                type="button"
                onClick={handleDownloadClick}
                className="group inline-flex items-center gap-2.5 rounded-full bg-ember-500 px-6 py-3.5 text-sm font-semibold text-obsidian-950 shadow-ember transition-all hover:bg-ember-400 active:scale-[0.98]"
              >
                <Download
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
                  aria-hidden="true"
                />
                <span>Download CV</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => scrollToSection(SECTION_IDS.CONTACT)}
              onMouseEnter={() => setIsPhoneRinging(true)}
              onMouseLeave={() => setIsPhoneRinging(false)}
              onFocus={() => setIsPhoneRinging(true)}
              onBlur={() => setIsPhoneRinging(false)}
              className="group inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-obsidian-900/70 px-6 py-3.5 text-sm font-semibold text-smoke-50 backdrop-blur-md transition-all hover:border-ember-400/50 hover:bg-obsidian-800/80"
            >
              <motion.span
                animate={
                  isPhoneRinging && !prefersReducedMotion
                    ? { rotate: [0, -14, 14, -10, 10, 0] }
                    : { rotate: 0 }
                }
                transition={{ duration: 0.55, ease: 'easeInOut' }}
                className="inline-flex"
              >
                <PhoneCall
                  className="h-4 w-4 text-ember-400"
                  aria-hidden="true"
                />
              </motion.span>
              <span>Get in Touch</span>
            </button>

            <button
              type="button"
              onClick={onReplayIntro}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-3 text-xs font-medium uppercase tracking-widest text-smoke-300 transition-colors hover:border-white/25 hover:text-smoke-50"
              aria-label="Replay portfolio intro video"
            >
              <Play className="h-3.5 w-3.5 text-ember-400" aria-hidden="true" />
              <span>Replay Intro</span>
            </button>
          </div>

          {showResumeNotice && !isResumeAvailable && (
            <div
              role="status"
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-ember-500/30 bg-obsidian-900/90 px-4 py-2.5 text-xs text-smoke-200"
            >
              <FileWarning
                className="h-4 w-4 shrink-0 text-ember-400"
                aria-hidden="true"
              />
              <span>
                Resume PDF is not uploaded yet. Place your file at{' '}
                <code className="font-mono text-ember-300">
                  public/documents/resume.pdf
                </code>{' '}
                or upload it from the Admin Dashboard.
              </span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Subtle Scroll Down Indicator */}
      <button
        type="button"
        onClick={() => scrollToSection(SECTION_IDS.ABOUT)}
        aria-label="Scroll to About Me section"
        className="group absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-smoke-300 transition-colors hover:text-ember-300"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.28em]">
          Scroll
        </span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-obsidian-900/60 transition-colors group-hover:border-ember-400/50">
          <ArrowDown
            className={`h-3.5 w-3.5 ${
              prefersReducedMotion ? '' : 'animate-bounce'
            }`}
            aria-hidden="true"
          />
        </span>
      </button>
    </section>
  );
}
