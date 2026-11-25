import { ArrowUp, Github, Linkedin, Mail } from 'lucide-react';
import { SECTION_IDS } from '@/config/theme.config';
import type { ContactDetails, FooterContent } from '@/types/portfolio';

interface FooterSectionProps {
  footer: FooterContent;
  contact: ContactDetails;
}

export function FooterSection({ footer, contact }: FooterSectionProps) {
  const currentYear = new Date().getFullYear();

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFooterEmailClick = () => {
    navigator.clipboard?.writeText(contact.email).catch(() => {});
  };

  return (
    <footer
      id={SECTION_IDS.FOOTER}
      className="relative border-t border-white/10 bg-obsidian-950/85 px-5 py-14 backdrop-blur-md sm:px-8 lg:px-12"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ember-400">
              {footer.statusLine}
            </p>
            <p className="mt-2 font-display text-2xl font-semibold tracking-wide text-smoke-100 sm:text-3xl">
              {footer.tagline}
            </p>
          </div>

          <button
            type="button"
            onClick={handleBackToTop}
            aria-label="Back to top"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-obsidian-900 px-4 py-2.5 text-xs font-medium uppercase tracking-widest text-smoke-200 transition-colors hover:border-ember-400/50 hover:text-smoke-50"
          >
            <ArrowUp className="h-3.5 w-3.5 text-ember-400" aria-hidden="true" />
            <span>Back to Top</span>
          </button>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-smoke-400">
            &copy; {currentYear} {footer.ownerName}. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            <a
              href={contact.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Amrith LinkedIn profile"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-obsidian-900 text-smoke-300 transition-colors hover:border-ember-400/50 hover:text-smoke-50"
            >
              <Linkedin className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href={contact.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Amrith GitHub profile"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-obsidian-900 text-smoke-300 transition-colors hover:border-ember-400/50 hover:text-smoke-50"
            >
              <Github className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href={`mailto:${contact.email}`}
              onClick={handleFooterEmailClick}
              aria-label={`Email Amrith (${contact.email})`}
              title={`Email ${contact.email}`}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-obsidian-900 text-smoke-300 transition-colors hover:border-ember-400/50 hover:text-smoke-50"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
