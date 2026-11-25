import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Copy,
  Github,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
} from 'lucide-react';
import { SectionHeader } from '@/components/common/SectionHeader';
import { SECTION_IDS } from '@/config/theme.config';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';
import { sanitizePhoneHref } from '@/lib/utils';
import { submitContactMessage } from '@/services/portfolioService';
import type { ContactDetails } from '@/types/portfolio';

interface ContactSectionProps {
  contact: ContactDetails;
}

interface FormState {
  fullName: string;
  email: string;
  subject: string;
  message: string;
  honeypot: string;
}

type FieldErrors = Partial<Record<'fullName' | 'email' | 'subject' | 'message', string>>;

const INITIAL_FORM: FormState = {
  fullName: '',
  email: '',
  subject: '',
  message: '',
  honeypot: '',
};

export function ContactSection({ contact }: ContactSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);
  const [emailFallbackVisible, setEmailFallbackVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const validateFields = (current: FormState): FieldErrors => {
    const errors: FieldErrors = {};
    if (current.fullName.trim().length < 2) {
      errors.fullName = 'Please enter your full name (at least 2 characters).';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(current.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }
    if (current.subject.trim().length < 3) {
      errors.subject = 'Please enter a subject (at least 3 characters).';
    }
    if (current.message.trim().length < 10) {
      errors.message = 'Please enter a message of at least 10 characters.';
    }
    return errors;
  };

  const handleFieldChange = (
    field: keyof Omit<FormState, 'honeypot'>,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCopy = async (label: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLabel(label);
      window.setTimeout(() => {
        setCopiedLabel((prev) => (prev === label ? null : prev));
      }, 2000);
    } catch {
      // Clipboard may be unavailable in non-HTTPS contexts
    }
  };

  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(contact.email)}`;

  const handleEmailLinkClick = () => {
    handleCopy('Email', contact.email);
    setEmailFallbackVisible(true);
    window.setTimeout(() => {
      setEmailFallbackVisible(false);
    }, 6000);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setFeedback(null);

    if (form.honeypot.trim().length > 0) {
      return;
    }

    const errors = validateFields(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setFeedback({
        type: 'error',
        message: 'Please fix the highlighted fields before sending.',
      });
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);
    try {
      const result = await submitContactMessage({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
        honeypot: form.honeypot,
      });

      if (result.ok) {
        setFeedback({
          type: 'success',
          message: 'Your message has been sent. Thank you for reaching out!',
        });
        setForm(INITIAL_FORM);
      } else {
        setFeedback({
          type: 'error',
          message:
            result.error ??
            'Unable to send message right now. Please reach out directly via email.',
        });
      }
    } catch {
      setFeedback({
        type: 'error',
        message:
          'An unexpected error occurred while sending your message. Please try emailing directly.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const linkCards = [
    {
      label: 'Email',
      value: contact.email,
      href: `mailto:${contact.email}`,
      icon: Mail,
      external: false,
      copyable: true,
    },
    {
      label: 'Mobile',
      value: contact.phone,
      href: sanitizePhoneHref(contact.phone),
      icon: Phone,
      external: false,
      copyable: true,
    },
    {
      label: 'Location',
      value: contact.location,
      href: undefined,
      icon: MapPin,
      external: false,
      copyable: false,
    },
    {
      label: 'LinkedIn',
      value: 'linkedin.com/in/amrith-karuppasamy-00bb08438',
      href: contact.linkedinUrl,
      icon: Linkedin,
      external: true,
      copyable: false,
    },
    {
      label: 'GitHub',
      value: 'github.com/amrithkaruppasamy6122k',
      href: contact.githubUrl,
      icon: Github,
      external: true,
      copyable: false,
    },
  ];

  return (
    <section
      id={SECTION_IDS.CONTACT}
      className="relative scroll-mt-20 px-5 py-20 sm:scroll-mt-24 sm:px-8 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader eyebrow="05 / Reach Out" title={contact.heading} />

        <div className="mb-10 max-w-3xl space-y-3">
          {contact.introParagraphs.map((paragraph, idx) => (
            <p
              key={idx}
              className="text-sm leading-relaxed text-smoke-200 sm:text-base"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Card: My Links */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55 }}
            className="cinematic-card rounded-2xl p-6 sm:p-8 lg:col-span-5"
          >
            <h3 className="mb-5 font-display text-2xl font-bold uppercase tracking-wide text-smoke-50">
              My Links
            </h3>

            <div className="space-y-3">
              {linkCards.map((item) => {
                const Icon = item.icon;
                const isCopied = copiedLabel === item.label;

                return (
                  <div
                    key={item.label}
                    className="group flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-obsidian-900/60 p-4 transition-all hover:border-ember-500/45 hover:bg-obsidian-800/80"
                  >
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noopener noreferrer' : undefined}
                        onClick={
                          item.label === 'Email' ? handleEmailLinkClick : undefined
                        }
                        className="flex min-w-0 flex-1 items-center justify-between gap-3"
                      >
                        <div className="flex min-w-0 items-center gap-3.5">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-obsidian-900 text-ember-400">
                            <Icon className="h-4 w-4" aria-hidden="true" />
                          </span>
                          <div className="min-w-0">
                            <p className="font-mono text-[11px] uppercase tracking-wider text-smoke-400">
                              {item.label}
                            </p>
                            <p className="truncate text-sm font-medium text-smoke-100">
                              {item.value}
                            </p>
                          </div>
                        </div>
                        <ArrowUpRight
                          className="h-4 w-4 shrink-0 text-smoke-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ember-400"
                          aria-hidden="true"
                        />
                      </a>
                    ) : (
                      <div className="flex min-w-0 flex-1 items-center gap-3.5">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-obsidian-900 text-ember-400">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <p className="font-mono text-[11px] uppercase tracking-wider text-smoke-400">
                            {item.label}
                          </p>
                          <p className="truncate text-sm font-medium text-smoke-100">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    )}

                    {item.label === 'Email' && (
                      <a
                        href={gmailComposeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Compose email in Gmail"
                        className="ml-1 inline-flex h-8 shrink-0 items-center rounded-lg border border-white/10 bg-obsidian-950/70 px-2.5 font-mono text-[11px] text-smoke-200 transition-colors hover:border-ember-400/50 hover:text-ember-300"
                      >
                        Gmail
                      </a>
                    )}

                    {item.copyable && (
                      <button
                        type="button"
                        onClick={() => handleCopy(item.label, item.value)}
                        aria-label={`Copy ${item.label}`}
                        className="ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-obsidian-950/70 text-smoke-300 transition-colors hover:border-ember-400/50 hover:text-ember-300"
                      >
                        {isCopied ? (
                          <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {emailFallbackVisible && (
              <p
                role="status"
                className="mt-3 rounded-xl border border-ember-500/30 bg-obsidian-950/80 px-3.5 py-2.5 text-xs text-smoke-200"
              >
                Opening your default mail app (email copied to clipboard). If no
                mail app opened,{' '}
                <a
                  href={gmailComposeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-ember-300 underline underline-offset-2 hover:text-ember-200"
                >
                  compose in Gmail
                </a>
                .
              </p>
            )}
          </motion.div>

          {/* Right Card: Send Me a Message */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="cinematic-card rounded-2xl p-6 sm:p-8 lg:col-span-7"
          >
            <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-smoke-50">
              Send Me a Message
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-smoke-300">
              {contact.formDescription}
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
              <div className="hidden" aria-hidden="true">
                <label htmlFor="contact-company">Leave this field empty</label>
                <input
                  id="contact-company"
                  name="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.honeypot}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, honeypot: e.target.value }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-smoke-300"
                  >
                    Full Name
                  </label>
                  <input
                    id="contact-name"
                    name="fullName"
                    type="text"
                    required
                    aria-invalid={Boolean(fieldErrors.fullName)}
                    aria-describedby={
                      fieldErrors.fullName ? 'contact-name-error' : undefined
                    }
                    value={form.fullName}
                    onChange={(e) => handleFieldChange('fullName', e.target.value)}
                    placeholder="Your name"
                    className={cn(
                      'w-full rounded-xl border bg-obsidian-950/75 px-4 py-3 text-sm text-smoke-50 placeholder:text-smoke-400 focus:outline-none',
                      fieldErrors.fullName
                        ? 'border-ember-400'
                        : 'border-white/10 focus:border-ember-400'
                    )}
                  />
                  {fieldErrors.fullName && (
                    <p
                      id="contact-name-error"
                      className="mt-1 text-xs text-ember-300"
                    >
                      {fieldErrors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-smoke-300"
                  >
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={
                      fieldErrors.email ? 'contact-email-error' : undefined
                    }
                    value={form.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    placeholder="you@example.com"
                    className={cn(
                      'w-full rounded-xl border bg-obsidian-950/75 px-4 py-3 text-sm text-smoke-50 placeholder:text-smoke-400 focus:outline-none',
                      fieldErrors.email
                        ? 'border-ember-400'
                        : 'border-white/10 focus:border-ember-400'
                    )}
                  />
                  {fieldErrors.email && (
                    <p
                      id="contact-email-error"
                      className="mt-1 text-xs text-ember-300"
                    >
                      {fieldErrors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-smoke-300"
                >
                  Subject
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  required
                  aria-invalid={Boolean(fieldErrors.subject)}
                  aria-describedby={
                    fieldErrors.subject ? 'contact-subject-error' : undefined
                  }
                  value={form.subject}
                  onChange={(e) => handleFieldChange('subject', e.target.value)}
                  placeholder="Opportunity, project collaboration, or inquiry"
                  className={cn(
                    'w-full rounded-xl border bg-obsidian-950/75 px-4 py-3 text-sm text-smoke-50 placeholder:text-smoke-400 focus:outline-none',
                    fieldErrors.subject
                      ? 'border-ember-400'
                      : 'border-white/10 focus:border-ember-400'
                  )}
                />
                {fieldErrors.subject && (
                  <p
                    id="contact-subject-error"
                    className="mt-1 text-xs text-ember-300"
                  >
                    {fieldErrors.subject}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-smoke-300"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  required
                  aria-invalid={Boolean(fieldErrors.message)}
                  aria-describedby={
                    fieldErrors.message ? 'contact-message-error' : undefined
                  }
                  value={form.message}
                  onChange={(e) => handleFieldChange('message', e.target.value)}
                  placeholder="Tell me about your project or opportunity..."
                  className={cn(
                    'w-full resize-y rounded-xl border bg-obsidian-950/75 px-4 py-3 text-sm text-smoke-50 placeholder:text-smoke-400 focus:outline-none',
                    fieldErrors.message
                      ? 'border-ember-400'
                      : 'border-white/10 focus:border-ember-400'
                  )}
                />
                {fieldErrors.message && (
                  <p
                    id="contact-message-error"
                    className="mt-1 text-xs text-ember-300"
                  >
                    {fieldErrors.message}
                  </p>
                )}
              </div>

              {feedback && (
                <div
                  role="alert"
                  className={`flex items-start gap-2.5 rounded-xl border p-3.5 text-xs leading-relaxed ${
                    feedback.type === 'success'
                      ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-200'
                      : 'border-ember-500/35 bg-ember-500/10 text-ember-200'
                  }`}
                >
                  {feedback.type === 'success' ? (
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400"
                      aria-hidden="true"
                    />
                  ) : (
                    <AlertCircle
                      className="mt-0.5 h-4 w-4 shrink-0 text-ember-400"
                      aria-hidden="true"
                    />
                  )}
                  <span>{feedback.message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ember-500 px-6 py-3.5 text-sm font-semibold text-obsidian-950 shadow-ember transition-all hover:bg-ember-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" aria-hidden="true" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
