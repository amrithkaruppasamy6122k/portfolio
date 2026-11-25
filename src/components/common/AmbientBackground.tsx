import { useState } from 'react';

interface AmbientBackgroundProps {
  imageSrc: string;
}

/**
 * Primary cinematic background derived directly from the supplied background image.
 * Sits at z-0 inside MainLayout's isolated stacking context (above html/body base color,
 * below z-10 page sections) so the smoke and ember texture remains visible everywhere.
 */
export function AmbientBackground({ imageSrc }: AmbientBackgroundProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-obsidian-950"
      aria-hidden="true"
    >
      {!hasError && (
        <img
          src={imageSrc}
          alt=""
          onError={() => setHasError(true)}
          className="h-full w-full object-cover object-center opacity-90"
          loading="eager"
          decoding="async"
        />
      )}

      {/* Soft atmospheric vignette keeping smoke & ember details clearly visible */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 30%, rgba(4, 4, 5, 0.1) 0%, rgba(4, 4, 5, 0.38) 68%, rgba(4, 4, 5, 0.68) 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(4,4,5,0.22) 0%, rgba(4,4,5,0.1) 45%, rgba(4,4,5,0.42) 85%, rgba(4,4,5,0.68) 100%)',
        }}
      />
    </div>
  );
}
