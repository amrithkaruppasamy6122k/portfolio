import type { AssetConfig } from '@/types/portfolio';

/**
 * Central asset path configuration.
 * All media files can be overridden dynamically from the Admin Dashboard (Supabase Storage)
 * or updated here for static fallback paths.
 */
export const DEFAULT_ASSETS: AssetConfig = {
  introVideo: '/videos/intro.mp4',
  aboutVideo: '/videos/about-me.mp4',
  backgroundImage: '/images/portfolio-background.jpg',
  resumePdf: '/documents/resume.pdf',
};

export const SESSION_KEYS = {
  INTRO_PLAYED: 'amrith_portfolio_intro_seen',
} as const;
