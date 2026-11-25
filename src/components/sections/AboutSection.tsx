import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/common/SectionHeader';
import { VideoPlayer } from '@/components/media/VideoPlayer';
import { SECTION_IDS } from '@/config/theme.config';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { AboutContent } from '@/types/portfolio';

interface AboutSectionProps {
  content: AboutContent;
  videoSrc: string;
}

export function AboutSection({ content, videoSrc }: AboutSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id={SECTION_IDS.ABOUT}
      className="relative scroll-mt-20 px-5 py-20 sm:scroll-mt-24 sm:px-8 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="01 / Story & Transition"
          title="About Me"
          subtitle="Bridging healthcare discipline and analytical rigor with modern Artificial Intelligence and Full-Stack engineering."
        />

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Text on the left (desktop) & first on mobile */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 space-y-4 lg:col-span-6"
          >
            <div className="cinematic-card space-y-4 rounded-2xl p-6 sm:p-8">
              {content.paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className={
                    index === content.paragraphs.length - 1
                      ? 'border-l-2 border-ember-500/70 pl-4 text-sm font-medium leading-relaxed text-smoke-50 sm:text-base'
                      : 'text-sm leading-relaxed text-smoke-200 sm:text-base'
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>

          {/* 16:9 Landscape Video on the right (desktop) & underneath on mobile */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="order-2 lg:col-span-6"
          >
            <div className="space-y-3">
              <VideoPlayer
                src={videoSrc}
                label={content.videoLabel}
                autoplayWhenVisible
                loop
              />
              <p className="flex items-center justify-between px-1 font-mono text-xs text-smoke-300">
                <span>{content.videoLabel}</span>
                <span className="text-ember-400">16:9 • Autoplay in view</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
