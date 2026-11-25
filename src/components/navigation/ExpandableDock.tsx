import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Cpu, Home, Mail, User } from 'lucide-react';
import { NAV_ITEMS, type NavSectionId } from '@/config/theme.config';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';
import { scrollToSection } from '@/lib/utils';

const NAV_ICONS: Record<NavSectionId, typeof Home> = {
  home: Home,
  about: User,
  skills: Cpu,
  projects: Briefcase,
  contact: Mail,
};

export function ExpandableDock() {
  const activeSection = useActiveSection();
  const prefersReducedMotion = useReducedMotion();
  const [hoveredId, setHoveredId] = useState<NavSectionId | null>(null);
  const [mobileExpandedId, setMobileExpandedId] = useState<NavSectionId | null>(null);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!mobileExpandedId) return;
    const timer = window.setTimeout(() => {
      setMobileExpandedId(null);
    }, 2200);
    return () => window.clearTimeout(timer);
  }, [mobileExpandedId]);

  useEffect(() => {
    const handleOutsidePointer = (event: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setMobileExpandedId(null);
      }
    };
    document.addEventListener('pointerdown', handleOutsidePointer);
    return () => document.removeEventListener('pointerdown', handleOutsidePointer);
  }, []);

  const handleItemClick = (id: NavSectionId) => {
    const isTouchDevice =
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: none)').matches;

    if (isTouchDevice) {
      setMobileExpandedId(id);
    }

    scrollToSection(id);
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      const next = (index + 1) % NAV_ITEMS.length;
      buttonRefs.current[next]?.focus();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      const prev = (index - 1 + NAV_ITEMS.length) % NAV_ITEMS.length;
      buttonRefs.current[prev]?.focus();
    }
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-3.5 z-40 flex justify-center px-3 sm:top-5">
      <nav
        ref={navRef}
        aria-label="Primary portfolio navigation"
        className="pointer-events-auto flex max-w-[calc(100vw-1.5rem)] items-center gap-1 overflow-x-auto rounded-full border border-white/10 bg-obsidian-900/85 p-1.5 shadow-cinematic backdrop-blur-md [scrollbar-width:none] sm:gap-1.5 [&::-webkit-scrollbar]:hidden"
        onMouseLeave={() => setHoveredId(null)}
      >
        {NAV_ITEMS.map((item, index) => {
          const Icon = NAV_ICONS[item.id];
          const isActive = activeSection === item.id;
          const isExpanded =
            hoveredId === item.id || mobileExpandedId === item.id;

          return (
            <button
              key={item.id}
              ref={(el) => {
                buttonRefs.current[index] = el;
              }}
              type="button"
              onClick={() => handleItemClick(item.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPointerEnter={(e) => {
                if (e.pointerType === 'mouse') setHoveredId(item.id);
              }}
              onFocus={() => setHoveredId(item.id)}
              onBlur={(e) => {
                if (!navRef.current?.contains(e.relatedTarget as Node)) {
                  setHoveredId(null);
                }
              }}
              aria-label={item.label}
              aria-current={isActive ? 'location' : undefined}
              className={cn(
                'group relative flex h-10 shrink-0 items-center justify-center rounded-full px-3 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-400',
                isActive
                  ? 'bg-ember-500/20 text-ember-300 ring-1 ring-ember-500/40'
                  : 'text-smoke-200 hover:bg-white/5 hover:text-smoke-50'
              )}
            >
              <Icon
                className={cn(
                  'h-4 w-4 shrink-0 transition-transform duration-200',
                  isActive && 'text-ember-400',
                  isExpanded && 'scale-105'
                )}
                aria-hidden="true"
              />

              <motion.span
                initial={false}
                animate={{
                  width: isExpanded ? 'auto' : 0,
                  opacity: isExpanded ? 1 : 0,
                  marginLeft: isExpanded ? 8 : 0,
                }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0.01 }
                    : { type: 'spring', stiffness: 360, damping: 28 }
                }
                className="overflow-hidden whitespace-nowrap text-xs font-medium tracking-wide"
              >
                {item.label}
              </motion.span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}
