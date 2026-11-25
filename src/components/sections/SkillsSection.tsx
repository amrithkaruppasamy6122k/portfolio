import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/common/SectionHeader';
import { TechLogo } from '@/components/common/TechLogo';
import { SECTION_IDS } from '@/config/theme.config';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';
import type { SkillCategory } from '@/types/portfolio';

interface SkillsSectionProps {
  categories: SkillCategory[];
}

export function SkillsSection({ categories }: SkillsSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [hoveredSkillId, setHoveredSkillId] = useState<string | null>(null);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest('[data-skill-tile="true"]')) {
        setSelectedSkillId(null);
      }
    };
    document.addEventListener('pointerdown', handleOutsideClick);
    return () => document.removeEventListener('pointerdown', handleOutsideClick);
  }, []);

  const visibleCategories =
    activeCategoryId === 'all'
      ? categories
      : categories.filter((c) => c.id === activeCategoryId);

  return (
    <section
      ref={sectionRef}
      id={SECTION_IDS.SKILLS}
      className="relative scroll-mt-20 px-5 py-20 sm:scroll-mt-24 sm:px-8 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="02 / Technical Stack"
          title="Skills & Technologies"
          subtitle="Core languages, frameworks, AI pipelines, and cloud tooling used to build end-to-end applications. Hover or tap any icon to reveal its name."
        />

        {/* Category filter pills */}
        <div
          role="tablist"
          aria-label="Filter skills by category"
          className="mb-8 flex flex-wrap gap-2"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeCategoryId === 'all'}
            onClick={() => setActiveCategoryId('all')}
            className={cn(
              'rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors',
              activeCategoryId === 'all'
                ? 'border-ember-500/60 bg-ember-500/15 text-ember-300'
                : 'border-white/10 bg-obsidian-900/65 text-smoke-300 hover:border-white/25 hover:text-smoke-100'
            )}
          >
            All ({categories.reduce((sum, c) => sum + c.skills.length, 0)})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={activeCategoryId === cat.id}
              onClick={() => setActiveCategoryId(cat.id)}
              className={cn(
                'rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors',
                activeCategoryId === cat.id
                  ? 'border-ember-500/60 bg-ember-500/15 text-ember-300'
                  : 'border-white/10 bg-obsidian-900/65 text-smoke-300 hover:border-white/25 hover:text-smoke-100'
              )}
            >
              {cat.title}
            </button>
          ))}
        </div>

        <div
          className={cn(
            'grid grid-cols-1 gap-6',
            visibleCategories.length > 1
              ? 'md:grid-cols-2 xl:grid-cols-3'
              : 'max-w-2xl'
          )}
        >
          {visibleCategories.map((category, catIndex) => (
            <motion.div
              key={category.id}
              layout={!prefersReducedMotion}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.45,
                delay: prefersReducedMotion ? 0 : Math.min(catIndex * 0.04, 0.24),
              }}
              className="cinematic-card rounded-2xl p-6"
            >
              <h3 className="mb-5 flex items-center justify-between border-b border-white/10 pb-3 font-display text-xl font-bold uppercase tracking-wider text-smoke-50">
                <span>{category.title}</span>
                <span className="font-mono text-xs font-normal text-smoke-400">
                  {String(category.skills.length).padStart(2, '0')}
                </span>
              </h3>

              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill) => {
                  const isRevealed =
                    hoveredSkillId === skill.id || selectedSkillId === skill.id;
                  return (
                    <motion.button
                      key={skill.id}
                      data-skill-tile="true"
                      type="button"
                      onClick={() =>
                        setSelectedSkillId((prev) =>
                          prev === skill.id ? null : skill.id
                        )
                      }
                      onPointerEnter={(e) => {
                        if (e.pointerType === 'mouse') {
                          setHoveredSkillId(skill.id);
                        }
                      }}
                      onPointerLeave={(e) => {
                        if (e.pointerType === 'mouse') {
                          setHoveredSkillId((prev) =>
                            prev === skill.id ? null : prev
                          );
                        }
                      }}
                      onFocus={() => setHoveredSkillId(skill.id)}
                      onBlur={() =>
                        setHoveredSkillId((prev) =>
                          prev === skill.id ? null : prev
                        )
                      }
                      whileHover={prefersReducedMotion ? undefined : { scale: 1.06 }}
                      transition={{ type: 'spring', stiffness: 360, damping: 24 }}
                      aria-label={skill.name}
                      aria-pressed={selectedSkillId === skill.id}
                      className={cn(
                        'group relative flex h-14 min-w-[3.5rem] items-center justify-center rounded-xl border px-3.5 transition-all duration-200',
                        isRevealed
                          ? 'border-ember-500/50 bg-obsidian-800 shadow-ember'
                          : 'border-white/10 bg-obsidian-900/75 hover:border-ember-500/35'
                      )}
                    >
                      <TechLogo
                        logoKey={skill.logoKey}
                        name={skill.name}
                        className="h-6 w-6 shrink-0"
                      />

                      <motion.span
                        initial={false}
                        animate={{
                          width: isRevealed ? 'auto' : 0,
                          opacity: isRevealed ? 1 : 0,
                          marginLeft: isRevealed ? 10 : 0,
                        }}
                        transition={
                          prefersReducedMotion
                            ? { duration: 0.01 }
                            : { type: 'spring', stiffness: 380, damping: 28 }
                        }
                        className="overflow-hidden whitespace-nowrap text-xs font-medium text-smoke-100"
                      >
                        {skill.name}
                      </motion.span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
