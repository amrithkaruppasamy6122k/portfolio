import type { ReactNode } from 'react';
import { FullScreenSmokeCurtain } from '@/components/animations/SmokeTransition';
import { AmbientBackground } from '@/components/common/AmbientBackground';
import { ExpandableDock } from '@/components/navigation/ExpandableDock';

interface MainLayoutProps {
  backgroundImage: string;
  children: ReactNode;
}

export function MainLayout({ backgroundImage, children }: MainLayoutProps) {
  return (
    <div className="relative isolate min-h-screen bg-obsidian-950 text-smoke-50">
      <AmbientBackground imageSrc={backgroundImage} />
      <FullScreenSmokeCurtain />
      <ExpandableDock />
      <main className="relative z-10">{children}</main>
    </div>
  );
}
