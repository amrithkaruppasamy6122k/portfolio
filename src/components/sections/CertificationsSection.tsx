import { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Calendar, CheckCircle2, ExternalLink, FileText } from 'lucide-react';
import { CertificatePreviewModal } from '@/components/common/CertificatePreviewModal';
import { SectionHeader } from '@/components/common/SectionHeader';
import { SECTION_IDS } from '@/config/theme.config';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';
import { isValidHttpUrl, isValidMediaUrl } from '@/lib/utils';
import type { CertificateItem } from '@/types/portfolio';

interface CertificationsSectionProps {
  certificates: CertificateItem[];
}

export function CertificationsSection({
  certificates,
}: CertificationsSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [previewCertificate, setPreviewCertificate] =
    useState<CertificateItem | null>(null);

  const sortedCertificates = [...certificates].sort(
    (a, b) => a.sortOrder - b.sortOrder
  );

  const featured = sortedCertificates.filter((c) => c.featured);
  const standard = sortedCertificates.filter((c) => !c.featured);
  const ordered = [...featured, ...standard];

  const getBentoSpanClass = (cert: CertificateItem, index: number): string => {
    if (cert.featured) {
      return 'md:col-span-3 min-h-[220px]';
    }
    const standardIndex = index - featured.length;
    if (standardIndex < 3) {
      return 'md:col-span-2 min-h-[175px]';
    }
    return 'md:col-span-3 min-h-[175px]';
  };

  return (
    <section
      id={SECTION_IDS.CERTIFICATIONS}
      className="relative scroll-mt-20 px-5 py-20 sm:scroll-mt-24 sm:px-8 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="04 / Credentials"
          title="Certifications & Professional Learning"
          subtitle="Structured foundational and specialized training across Artificial Intelligence, Full-Stack engineering, cloud platforms, and core computer science."
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
          {ordered.map((cert, index) => {
            const hasCertUrl = isValidHttpUrl(cert.certificateUrl);
            const hasPreview = isValidMediaUrl(cert.previewUrl);

            return (
              <motion.article
                key={cert.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.45,
                  delay: prefersReducedMotion ? 0 : Math.min(index * 0.05, 0.25),
                }}
                whileHover={prefersReducedMotion ? undefined : { y: -3 }}
                className={cn(
                  'cinematic-card cinematic-card-hover relative flex flex-col justify-between overflow-hidden rounded-2xl p-6',
                  cert.featured && 'border-ember-500/30',
                  getBentoSpanClass(cert, index)
                )}
              >
                {hasPreview && (
                  <img
                    src={cert.previewUrl}
                    alt=""
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-15"
                    loading="lazy"
                  />
                )}

                <div className="relative z-10 flex items-start justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-[11px] font-medium text-emerald-300">
                    <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                    <span>{cert.status}</span>
                  </span>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-obsidian-900/80 text-ember-400">
                    <Award className="h-4 w-4" aria-hidden="true" />
                  </div>
                </div>

                <div className="relative z-10 mt-6">
                  <h3
                    className={cn(
                      'font-display font-bold uppercase tracking-wide text-smoke-50',
                      cert.featured ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
                    )}
                  >
                    {cert.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-smoke-300">
                    {cert.platform}
                  </p>

                  {(cert.completionDate || hasCertUrl || hasPreview) && (
                    <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-white/10 pt-3">
                      {cert.completionDate && (
                        <span className="inline-flex items-center gap-1.5 font-mono text-xs text-smoke-300">
                          <Calendar
                            className="h-3.5 w-3.5 text-ember-400"
                            aria-hidden="true"
                          />
                          <span>{cert.completionDate}</span>
                        </span>
                      )}

                      {hasCertUrl && (
                        <a
                          href={cert.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ember-300 transition-colors hover:text-ember-200"
                        >
                          <span>View Certificate</span>
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                      )}

                      {hasPreview && (
                        <button
                          type="button"
                          onClick={() => setPreviewCertificate(cert)}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-smoke-200 transition-colors hover:text-smoke-50"
                        >
                          <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Preview</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      <CertificatePreviewModal
        certificate={previewCertificate}
        onClose={() => setPreviewCertificate(null)}
      />
    </section>
  );
}
