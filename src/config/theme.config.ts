export const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
] as const;

export type NavSectionId = (typeof NAV_ITEMS)[number]['id'];

export const SECTION_IDS = {
  INTRO: 'intro',
  HOME: 'home',
  ABOUT: 'about',
  SKILLS: 'skills',
  PROJECTS: 'projects',
  CERTIFICATIONS: 'certifications',
  CONTACT: 'contact',
  FOOTER: 'footer',
} as const;
