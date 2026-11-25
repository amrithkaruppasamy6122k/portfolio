import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, X } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { CertificateItem } from '@/types/portfolio';

interface CertificatePreviewModalProps {
  certificate: CertificateItem | null;
  onClose: () => void;
}

export function CertificatePreviewModal({
  certificate,
  onClose,
}: CertificatePreviewModalProps) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!certificate) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [certificate, onClose]);

  const previewUrl = certificate?.previewUrl ?? '';
  const isPdf = previewUrl.toLowerCase().split('?')[0].endsWith('.pdf');

  return (
    <AnimatePresence>
      {certificate && previewUrl && (
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian-950/85 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label={`${certificate.title} certificate preview`}
        >
          <motion.div
            initial={prefersReducedMotion ? false : { scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="cinematic-card flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/15"
          >
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
              <div>
                <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-smoke-50">
                  {certificate.title}
                </h3>
                <p className="text-xs text-smoke-300">{certificate.platform}</p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-medium text-smoke-100 transition-colors hover:border-ember-400/50"
                >
                  <span>Open</span>
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close certificate preview"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-smoke-200 transition-colors hover:border-ember-400/50 hover:text-smoke-50"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto bg-obsidian-950/90 p-4">
              {isPdf ? (
                <iframe
                  src={previewUrl}
                  title={`${certificate.title} PDF preview`}
                  className="h-[70vh] w-full rounded-xl border border-white/10"
                />
              ) : (
                <img
                  src={previewUrl}
                  alt={`${certificate.title} certificate`}
                  className="mx-auto max-h-[72vh] w-auto rounded-xl object-contain"
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
