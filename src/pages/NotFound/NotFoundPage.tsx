import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AmbientBackground } from '@/components/common/AmbientBackground';
import { DEFAULT_ASSETS } from '@/config/assets.config';

export function NotFoundPage() {
  return (
    <div className="relative isolate flex min-h-screen items-center justify-center bg-obsidian-950 px-5 py-16">
      <AmbientBackground imageSrc={DEFAULT_ASSETS.backgroundImage} />

      <div className="cinematic-card relative z-10 w-full max-w-md rounded-2xl p-8 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-ember-400">
          404
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold uppercase tracking-wide text-smoke-50">
          Page Not Found
        </h1>
        <p className="mt-3 text-sm text-smoke-300">
          The page you requested does not exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-ember-500 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-obsidian-950 transition-colors hover:bg-ember-400"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Back Home</span>
        </Link>
      </div>
    </div>
  );
}
