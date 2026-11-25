import { useEffect, useId, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

let cachedSmokeTexture: string | null = null;

/**
 * Generates a high-detail 4-octave FBM wispy smoke-cloud sprite once per session.
 * Rich charcoal core + ash smoke wisps so overlapping curtains cover the viewport
 * naturally and part cleanly without harsh edges.
 */
function getFullSmokeTexture(): string {
  if (cachedSmokeTexture) return cachedSmokeTexture;
  if (typeof document === 'undefined') return '';

  const width = 512;
  const height = 384;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const img = ctx.createImageData(width, height);
  const data = img.data;

  const hash = (ix: number, iy: number): number => {
    const n = Math.sin(ix * 127.1 + iy * 311.7) * 43758.5453123;
    return n - Math.floor(n);
  };

  const smoothstep = (t: number) => t * t * (3 - 2 * t);

  const valueNoise = (x: number, y: number): number => {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = smoothstep(x - ix);
    const fy = smoothstep(y - iy);
    const a = hash(ix, iy);
    const b = hash(ix + 1, iy);
    const c = hash(ix, iy + 1);
    const d = hash(ix + 1, iy + 1);
    return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
  };

  const fbm = (x: number, y: number): number => {
    let val = 0;
    let amp = 0.52;
    let freq = 1;
    for (let i = 0; i < 4; i++) {
      val += amp * valueNoise(x * freq, y * freq);
      freq *= 2.02;
      amp *= 0.5;
    }
    return val;
  };

  for (let y = 0; y < height; y++) {
    const ny = y / height;
    const edgeY = Math.pow(Math.sin(ny * Math.PI), 0.45);

    for (let x = 0; x < width; x++) {
      const nx = x / width;
      const edgeX = Math.pow(Math.sin(nx * Math.PI), 0.45);

      const warpX = fbm(nx * 3.1 + 1.1, ny * 2.7 + 0.4);
      const warpY = fbm(nx * 3.1 + 4.7, ny * 2.7 + 2.3);
      const n = fbm(nx * 4.2 + warpX * 1.55, ny * 3.6 + warpY * 1.35);

      const density = Math.max(0, Math.min(1, (n - 0.24) * 1.85));
      const alpha = Math.round(density * edgeX * edgeY * 245);

      // Blend from deep obsidian smoke (#141519) to sunlit ash highlights (#8E929B)
      const shade = Math.round(22 + n * 125);
      const idx = (y * width + x) * 4;
      data[idx] = shade;
      data[idx + 1] = Math.min(255, shade + 2);
      data[idx + 2] = Math.min(255, shade + 6);
      data[idx + 3] = alpha;
    }
  }

  ctx.putImageData(img, 0, 0);
  cachedSmokeTexture = canvas.toDataURL('image/png');
  return cachedSmokeTexture;
}

interface CurtainTargets {
  root: HTMLDivElement;
  veil: HTMLDivElement;
  leftBank: HTMLDivElement;
  rightBank: HTMLDivElement;
  centerSwirl: HTMLDivElement;
}

let activeCurtain: CurtainTargets | null = null;
const seamProgressMap = new Map<string, number>();

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

function renderCurtainFromSeams() {
  if (!activeCurtain) return;

  // Pick the active seam closest to mid-transition (sin(p * PI) is maximal at p = 0.5)
  let bestStrength = 0;
  let bestProgress = 0;

  for (const progress of seamProgressMap.values()) {
    if (progress <= 0 || progress >= 1) continue;
    const strength = Math.sin(progress * Math.PI);
    if (strength > bestStrength) {
      bestStrength = strength;
      bestProgress = progress;
    }
  }

  const { root, veil, leftBank, rightBank, centerSwirl } = activeCurtain;

  if (bestStrength <= 0.01) {
    root.style.visibility = 'hidden';
    root.style.opacity = '0';
    return;
  }

  root.style.visibility = 'visible';
  root.style.opacity = '1';

  // Full-screen cover curve: ramps up 0..0.38, holds dense cover 0.38..0.62, disperses 0.62..1
  let coverOpacity: number;
  if (bestProgress < 0.38) {
    coverOpacity = easeInOut(clamp01(bestProgress / 0.38));
  } else if (bestProgress <= 0.62) {
    coverOpacity = 1;
  } else {
    coverOpacity = 1 - easeInOut(clamp01((bestProgress - 0.62) / 0.38));
  }

  // Curtain motion:
  // First half (0 -> 0.5): smoke banks roll IN from sides (-85% / +85%) to overlap (0%)
  // Second half (0.5 -> 1): smoke banks PART & OPEN outward (0% -> -105% / +105%)
  let leftX: number;
  let rightX: number;
  let cloudScale: number;

  if (bestProgress <= 0.5) {
    const t = easeInOut(clamp01(bestProgress / 0.5));
    leftX = -85 * (1 - t);
    rightX = 85 * (1 - t);
    cloudScale = 1.04 + t * 0.08;
  } else {
    const t = easeInOut(clamp01((bestProgress - 0.5) / 0.5));
    leftX = -105 * t;
    rightX = 105 * t;
    cloudScale = 1.12 + t * 0.14;
  }

  veil.style.opacity = String(coverOpacity * 0.88);

  leftBank.style.opacity = String(Math.min(1, coverOpacity * 0.98));
  leftBank.style.transform = `translate3d(${leftX}%, 0, 0) scale(${cloudScale})`;

  rightBank.style.opacity = String(Math.min(1, coverOpacity * 0.98));
  rightBank.style.transform = `translate3d(${rightX}%, 0, 0) scale(${-cloudScale}, ${cloudScale})`;

  centerSwirl.style.opacity = String(coverOpacity * 0.85);
  centerSwirl.style.transform = `translate3d(0, ${(0.5 - bestProgress) * 14}%, 0) scale(${1 + coverOpacity * 0.16})`;
}

/**
 * Shared full-viewport smoky cloud curtain mounted once in MainLayout.
 * Sits at z-30 (above page content z-10, below top navigation dock z-40 and modals z-50).
 */
export function FullScreenSmokeCurtain() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const veilRef = useRef<HTMLDivElement | null>(null);
  const leftBankRef = useRef<HTMLDivElement | null>(null);
  const rightBankRef = useRef<HTMLDivElement | null>(null);
  const centerSwirlRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const smokeTexture = useMemo(() => getFullSmokeTexture(), []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (
      !rootRef.current ||
      !veilRef.current ||
      !leftBankRef.current ||
      !rightBankRef.current ||
      !centerSwirlRef.current
    ) {
      return;
    }

    activeCurtain = {
      root: rootRef.current,
      veil: veilRef.current,
      leftBank: leftBankRef.current,
      rightBank: rightBankRef.current,
      centerSwirl: centerSwirlRef.current,
    };

    renderCurtainFromSeams();

    return () => {
      activeCurtain = null;
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <div
      ref={rootRef}
      style={{ visibility: 'hidden', opacity: 0 }}
      className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
      aria-hidden="true"
    >
      {/* Full-viewport dark charcoal mist backdrop that temporarily covers the screen */}
      <div
        ref={veilRef}
        className="absolute inset-0 bg-obsidian-950/90"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(28, 30, 36, 0.92) 0%, rgba(10, 11, 14, 0.97) 70%, rgba(4, 4, 5, 0.99) 100%)',
        }}
      />

      {/* Left billowing smoke cloud bank (slides in to cover, parts left to open next section) */}
      <div
        ref={leftBankRef}
        className="absolute -inset-y-12 -left-1/4 w-[88vw] will-change-transform"
        style={{
          backgroundImage: smokeTexture ? `url("${smokeTexture}")` : undefined,
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(12px) contrast(1.12)',
        }}
      />

      {/* Right billowing smoke cloud bank (slides in to cover, parts right to open next section) */}
      <div
        ref={rightBankRef}
        className="absolute -inset-y-12 -right-1/4 w-[88vw] will-change-transform"
        style={{
          backgroundImage: smokeTexture ? `url("${smokeTexture}")` : undefined,
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(12px) contrast(1.12)',
        }}
      />

      {/* Center atmospheric smoke swirl */}
      <div
        ref={centerSwirlRef}
        className="absolute -inset-12 will-change-transform"
        style={{
          backgroundImage: smokeTexture ? `url("${smokeTexture}")` : undefined,
          backgroundSize: '115% 110%',
          backgroundPosition: 'center',
          filter: 'blur(18px) brightness(0.95)',
        }}
      />
    </div>
  );
}

/**
 * ScrollTrigger seam placed between major portfolio sections.
 * Drives the full-screen smoky cloud curtain to cover the viewport between pages
 * and smoothly part open as the next section enters view.
 */
export function SmokeTransition() {
  const seamId = useId();
  const seamRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const seam = seamRef.current;
    if (!seam) return;

    const trigger = ScrollTrigger.create({
      trigger: seam,
      start: 'top 85%',
      end: 'bottom 30%',
      scrub: true,
      onUpdate: (self) => {
        seamProgressMap.set(seamId, self.progress);
        renderCurtainFromSeams();
      },
      onLeave: () => {
        seamProgressMap.set(seamId, 1);
        renderCurtainFromSeams();
      },
      onLeaveBack: () => {
        seamProgressMap.set(seamId, 0);
        renderCurtainFromSeams();
      },
    });

    return () => {
      trigger.kill();
      seamProgressMap.delete(seamId);
      renderCurtainFromSeams();
    };
  }, [seamId, prefersReducedMotion]);

  return (
    <div
      ref={seamRef}
      className="pointer-events-none relative h-24 w-full sm:h-36"
      aria-hidden="true"
    >
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}
