import { useEffect, useState } from 'react';
import { SmokeTransition } from '@/components/animations/SmokeTransition';
import { AboutSection } from '@/components/sections/AboutSection';
import { CertificationsSection } from '@/components/sections/CertificationsSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { FooterSection } from '@/components/sections/FooterSection';
import { HeroSection } from '@/components/sections/HeroSection';
import { IntroExperience } from '@/components/sections/IntroExperience';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { SESSION_KEYS } from '@/config/assets.config';
import { DEFAULT_PORTFOLIO_DATA } from '@/config/portfolio.data';
import { MainLayout } from '@/layouts/MainLayout';
import { fetchPortfolioData } from '@/services/portfolioService';
import type { PortfolioData } from '@/types/portfolio';

export function HomePage() {
  const [data, setData] = useState<PortfolioData>(DEFAULT_PORTFOLIO_DATA);
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return window.sessionStorage.getItem(SESSION_KEYS.INTRO_PLAYED) !== 'true';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    let active = true;
    fetchPortfolioData().then((loaded) => {
      if (active) setData(loaded);
    });
    return () => {
      active = false;
    };
  }, []);

  const handleIntroComplete = () => {
    try {
      window.sessionStorage.setItem(SESSION_KEYS.INTRO_PLAYED, 'true');
    } catch {
      // Ignore storage errors in restricted environments
    }
    setShowIntro(false);
  };

  const handleReplayIntro = () => {
    setShowIntro(true);
  };

  return (
    <>
      <IntroExperience
        videoSrc={data.assets.introVideo}
        isOpen={showIntro}
        onComplete={handleIntroComplete}
      />

      <MainLayout backgroundImage={data.assets.backgroundImage}>
        <HeroSection
          content={data.hero}
          resumeUrl={data.assets.resumePdf}
          onReplayIntro={handleReplayIntro}
        />

        <SmokeTransition />

        <AboutSection content={data.about} videoSrc={data.assets.aboutVideo} />

        <SmokeTransition />

        <SkillsSection categories={data.skillCategories} />

        <SmokeTransition />

        <ProjectsSection projects={data.projects} />

        <SmokeTransition />

        <CertificationsSection certificates={data.certificates} />

        <SmokeTransition />

        <ContactSection contact={data.contact} />

        <FooterSection footer={data.footer} contact={data.contact} />
      </MainLayout>
    </>
  );
}
