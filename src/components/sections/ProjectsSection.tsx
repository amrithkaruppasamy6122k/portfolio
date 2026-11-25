import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronDown, ExternalLink, Github } from 'lucide-react';
import { SectionHeader } from '@/components/common/SectionHeader';
import { SECTION_IDS } from '@/config/theme.config';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';
import { isValidHttpUrl, isValidMediaUrl } from '@/lib/utils';
import type { ProjectItem } from '@/types/portfolio';

interface ProjectsSectionProps {
  projects: ProjectItem[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mobileExpandedIndex, setMobileExpandedIndex] = useState<number | null>(0);
  const desktopAccordionRef = useRef<HTMLDivElement | null>(null);

  const sortedProjects = [...projects].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section
      id={SECTION_IDS.PROJECTS}
      className="relative scroll-mt-20 px-5 py-20 sm:scroll-mt-24 sm:px-8 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="03 / Selected Systems"
          title="Featured Projects"
          subtitle="Six full-stack and AI-powered systems engineered for real-world operational workflows. Hover any panel on desktop or tap on mobile to inspect details."
        />

        {/* Horizontal Animated Accordion (md and above) */}
        <div
          ref={desktopAccordionRef}
          className="hidden h-[500px] w-full gap-2.5 md:flex lg:gap-3"
          onMouseLeave={() => setHoveredIndex(null)}
          onBlur={(e) => {
            if (!desktopAccordionRef.current?.contains(e.relatedTarget as Node)) {
              setHoveredIndex(null);
            }
          }}
        >
          {sortedProjects.map((project, index) => {
            const isExpanded = hoveredIndex === index;
            const hasImage = isValidMediaUrl(project.imageUrl);
            const hasGithub = isValidHttpUrl(project.githubUrl);
            const hasLive = isValidHttpUrl(project.liveUrl);

            return (
              <motion.article
                key={project.id}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseMove={() => {
                  if (hoveredIndex !== index) {
                    setHoveredIndex(index);
                  }
                }}
                onFocus={() => setHoveredIndex(index)}
                onClick={() => {
                  const isTouch =
                    typeof window !== 'undefined' &&
                    window.matchMedia('(hover: none)').matches;
                  if (isTouch) {
                    setHoveredIndex((prev) => (prev === index ? null : index));
                  }
                }}
                tabIndex={0}
                aria-expanded={isExpanded}
                animate={{
                  flexGrow: hoveredIndex === null ? 1 : isExpanded ? 4.5 : 0.7,
                }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0.01 }
                    : { type: 'spring', stiffness: 220, damping: 28 }
                }
                className={cn(
                  'group relative flex min-w-0 basis-0 cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border p-4 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-400 lg:p-6',
                  isExpanded
                    ? 'border-ember-500/45 bg-obsidian-850/95 shadow-cinematic'
                    : 'border-white/10 bg-obsidian-900/80 hover:border-white/20'
                )}
              >
                {hasImage && (
                  <img
                    src={project.imageUrl}
                    alt={`${project.title} preview`}
                    className={cn(
                      'pointer-events-none absolute inset-0 h-full w-full object-cover transition-all duration-500',
                      isExpanded
                        ? 'scale-105 opacity-45'
                        : 'opacity-65 group-hover:opacity-80'
                    )}
                    decoding="async"
                  />
                )}

                <div
                  className={cn(
                    'pointer-events-none absolute inset-0 transition-opacity',
                    isExpanded
                      ? 'bg-gradient-to-t from-obsidian-950 via-obsidian-950/75 to-obsidian-950/25'
                      : 'bg-gradient-to-t from-obsidian-950/95 via-obsidian-950/45 to-obsidian-950/15'
                  )}
                  aria-hidden="true"
                />

                <div className="relative z-10 flex items-center justify-between">
                  <span
                    className={cn(
                      'rounded-full border border-white/15 bg-obsidian-950/70 px-2.5 py-0.5 font-mono text-xs tracking-[0.2em] backdrop-blur-sm',
                      isExpanded
                        ? 'border-ember-500/45 text-ember-400'
                        : 'text-smoke-100'
                    )}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                {!isExpanded ? (
                  <div className="relative z-10 flex flex-1 items-end pb-2">
                    <h3 className="line-clamp-3 font-display text-lg font-bold uppercase leading-tight tracking-wide text-smoke-50 drop-shadow-sm lg:text-xl">
                      {project.title}
                    </h3>
                  </div>
                ) : (
                  <motion.div
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="relative z-10 mt-3 flex flex-1 flex-col justify-between gap-4 overflow-y-auto pr-1"
                  >
                    <div>
                      <h3 className="font-display text-2xl font-bold uppercase leading-tight tracking-wide text-smoke-50 lg:text-3xl">
                        {project.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-smoke-200">
                        {project.description}
                      </p>

                      <div className="mt-4">
                        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ember-400">
                          Key Features
                        </p>
                        <ul className="grid grid-cols-1 gap-x-4 gap-y-1.5 lg:grid-cols-2">
                          {project.features.map((feature) => (
                            <li
                              key={feature}
                              className="flex items-start gap-2 text-xs text-smoke-100"
                            >
                              <CheckCircle2
                                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ember-400"
                                aria-hidden="true"
                              />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {project.technologies.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {project.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="rounded-full border border-white/10 bg-obsidian-950/70 px-2.5 py-0.5 font-mono text-[11px] text-smoke-200"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {(hasGithub || hasLive) && (
                      <div
                        className="flex flex-wrap items-center gap-3 pt-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {hasGithub && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-obsidian-900 px-4 py-2 text-xs font-medium text-smoke-100 transition-colors hover:border-ember-400/50 hover:text-smoke-50"
                          >
                            <Github className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>GitHub</span>
                          </a>
                        )}
                        {hasLive && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full bg-ember-500 px-4 py-2 text-xs font-semibold text-obsidian-950 transition-colors hover:bg-ember-400"
                          >
                            <ExternalLink
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            />
                            <span>Live Demo</span>
                          </a>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.article>
            );
          })}
        </div>

        {/* Mobile Tap-to-Expand Accordion (< md) */}
        <div className="space-y-3 md:hidden">
          {sortedProjects.map((project, index) => {
            const isExpanded = mobileExpandedIndex === index;
            const hasImage = isValidMediaUrl(project.imageUrl);
            const hasGithub = isValidHttpUrl(project.githubUrl);
            const hasLive = isValidHttpUrl(project.liveUrl);

            return (
              <div
                key={project.id}
                className={cn(
                  'cinematic-card overflow-hidden rounded-2xl transition-colors',
                  isExpanded && 'border-ember-500/45'
                )}
              >
                <button
                  type="button"
                  onClick={() =>
                    setMobileExpandedIndex((prev) =>
                      prev === index ? null : index
                    )
                  }
                  aria-expanded={isExpanded}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="font-mono text-xs text-ember-400">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-display text-xl font-bold uppercase tracking-wide text-smoke-50">
                      {project.title}
                    </h3>
                  </div>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 shrink-0 text-smoke-300 transition-transform duration-300',
                      isExpanded && 'rotate-180 text-ember-400'
                    )}
                    aria-hidden="true"
                  />
                </button>

                {isExpanded && (
                  <div className="border-t border-white/10 px-5 pb-5 pt-4">
                    {hasImage && (
                      <div className="mb-4 aspect-video overflow-hidden rounded-xl border border-white/10">
                        <img
                          src={project.imageUrl}
                          alt={`${project.title} preview`}
                          className="h-full w-full object-cover"
                          decoding="async"
                        />
                      </div>
                    )}

                    <p className="text-sm leading-relaxed text-smoke-200">
                      {project.description}
                    </p>

                    <div className="mt-4">
                      <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ember-400">
                        Key Features
                      </p>
                      <ul className="space-y-1.5">
                        {project.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-2 text-xs text-smoke-200"
                          >
                            <CheckCircle2
                              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ember-400"
                              aria-hidden="true"
                            />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {project.technologies.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[11px] text-smoke-200"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {(hasGithub || hasLive) && (
                      <div className="mt-4 flex flex-wrap gap-3">
                        {hasGithub && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-obsidian-900 px-4 py-2 text-xs font-medium text-smoke-100"
                          >
                            <Github className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>GitHub</span>
                          </a>
                        )}
                        {hasLive && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full bg-ember-500 px-4 py-2 text-xs font-semibold text-obsidian-950"
                          >
                            <ExternalLink
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            />
                            <span>Live Demo</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
