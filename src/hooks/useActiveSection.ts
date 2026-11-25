import { useEffect, useState } from 'react';
import { NAV_ITEMS, type NavSectionId } from '@/config/theme.config';

export function useActiveSection(): NavSectionId {
  const [activeSection, setActiveSection] = useState<NavSectionId>('home');

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(
      (el): el is HTMLElement => el !== null
    );

    if (sections.length === 0) return;

    const updateActiveByScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY < 100) {
        setActiveSection('home');
        return;
      }

      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      if (scrollY + winHeight >= docHeight - 120) {
        setActiveSection('contact');
        return;
      }

      const triggerLine = scrollY + winHeight * 0.35;
      let current: NavSectionId = 'home';

      for (const section of sections) {
        if (section.offsetTop <= triggerLine) {
          current = section.id as NavSectionId;
        }
      }

      setActiveSection(current);
    };

    const observer = new IntersectionObserver(
      () => {
        updateActiveByScroll();
      },
      {
        rootMargin: '-20% 0px -45% 0px',
        threshold: [0, 0.25, 0.5],
      }
    );

    sections.forEach((section) => observer.observe(section));
    window.addEventListener('scroll', updateActiveByScroll, { passive: true });
    updateActiveByScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', updateActiveByScroll);
    };
  }, []);

  return activeSection;
}
