export interface AssetConfig {
  introVideo: string;
  aboutVideo: string;
  backgroundImage: string;
  resumePdf: string;
}

export interface HeroContent {
  greeting: string;
  name: string;
  title: string;
  description: string;
  identityTag: string;
}

export interface AboutContent {
  paragraphs: string[];
  videoLabel: string;
}

export interface SkillItem {
  id: string;
  name: string;
  logoKey: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  skills: SkillItem[];
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  features: string[];
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  sortOrder: number;
}

export interface CertificateItem {
  id: string;
  title: string;
  platform: string;
  status: 'Completed';
  completionDate?: string;
  certificateUrl?: string;
  previewUrl?: string;
  featured?: boolean;
  sortOrder: number;
}

export interface ContactDetails {
  heading: string;
  introParagraphs: string[];
  formDescription: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  githubUrl: string;
}

export interface FooterContent {
  statusLine: string;
  tagline: string;
  ownerName: string;
}

export interface PortfolioData {
  assets: AssetConfig;
  hero: HeroContent;
  about: AboutContent;
  skillCategories: SkillCategory[];
  projects: ProjectItem[];
  certificates: CertificateItem[];
  contact: ContactDetails;
  footer: FooterContent;
}

export interface ContactMessagePayload {
  fullName: string;
  email: string;
  subject: string;
  message: string;
  honeypot?: string;
}
