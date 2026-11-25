import { useState } from 'react';
import { Loader2, Plus, Save, Trash2 } from 'lucide-react';
import type { PortfolioData } from '@/types/portfolio';

interface AdminProfileTabProps {
  data: PortfolioData;
  onSave: (next: {
    hero: PortfolioData['hero'];
    about: PortfolioData['about'];
    contact: PortfolioData['contact'];
    footer: PortfolioData['footer'];
  }) => Promise<void>;
}

export function AdminProfileTab({ data, onSave }: AdminProfileTabProps) {
  const [hero, setHero] = useState(data.hero);
  const [about, setAbout] = useState(data.about);
  const [contact, setContact] = useState(data.contact);
  const [footer, setFooter] = useState(data.footer);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({ hero, about, contact, footer });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Settings */}
      <section className="cinematic-card rounded-2xl p-6">
        <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-smoke-50">
          Home / Hero Content
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block font-mono text-xs text-smoke-300">
              Greeting
            </label>
            <input
              type="text"
              value={hero.greeting}
              onChange={(e) => setHero({ ...hero, greeting: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-obsidian-950/80 px-3.5 py-2.5 text-sm text-smoke-50"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs text-smoke-300">
              Name
            </label>
            <input
              type="text"
              value={hero.name}
              onChange={(e) => setHero({ ...hero, name: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-obsidian-950/80 px-3.5 py-2.5 text-sm text-smoke-50"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs text-smoke-300">
              Professional Title
            </label>
            <input
              type="text"
              value={hero.title}
              onChange={(e) => setHero({ ...hero, title: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-obsidian-950/80 px-3.5 py-2.5 text-sm text-smoke-50"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs text-smoke-300">
              Identity Badge
            </label>
            <input
              type="text"
              value={hero.identityTag}
              onChange={(e) => setHero({ ...hero, identityTag: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-obsidian-950/80 px-3.5 py-2.5 text-sm text-smoke-50"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block font-mono text-xs text-smoke-300">
              Description
            </label>
            <textarea
              rows={3}
              value={hero.description}
              onChange={(e) => setHero({ ...hero, description: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-obsidian-950/80 px-3.5 py-2.5 text-sm text-smoke-50"
            />
          </div>
        </div>
      </section>

      {/* About Me */}
      <section className="cinematic-card rounded-2xl p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-smoke-50">
            About Me Content
          </h2>
          <button
            type="button"
            onClick={() =>
              setAbout({ ...about, paragraphs: [...about.paragraphs, ''] })
            }
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-1.5 text-xs text-smoke-100 hover:border-ember-400/50"
          >
            <Plus className="h-3.5 w-3.5 text-ember-400" />
            <span>Add Paragraph</span>
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {about.paragraphs.map((p, idx) => (
            <div key={idx} className="flex gap-2">
              <textarea
                rows={3}
                value={p}
                onChange={(e) => {
                  const next = [...about.paragraphs];
                  next[idx] = e.target.value;
                  setAbout({ ...about, paragraphs: next });
                }}
                className="flex-1 rounded-xl border border-white/10 bg-obsidian-950/80 px-3.5 py-2.5 text-sm text-smoke-50"
              />
              <button
                type="button"
                aria-label={`Remove paragraph ${idx + 1}`}
                onClick={() =>
                  setAbout({
                    ...about,
                    paragraphs: about.paragraphs.filter((_, i) => i !== idx),
                  })
                }
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-smoke-300 hover:border-ember-500/40 hover:text-ember-300"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}

          <div>
            <label className="mb-1 block font-mono text-xs text-smoke-300">
              About Video Caption
            </label>
            <input
              type="text"
              value={about.videoLabel}
              onChange={(e) => setAbout({ ...about, videoLabel: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-obsidian-950/80 px-3.5 py-2.5 text-sm text-smoke-50"
            />
          </div>
        </div>
      </section>

      {/* Contact & Footer */}
      <section className="cinematic-card rounded-2xl p-6">
        <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-smoke-50">
          Contact Details &amp; Footer
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block font-mono text-xs text-smoke-300">
              Email
            </label>
            <input
              type="email"
              value={contact.email}
              onChange={(e) => setContact({ ...contact, email: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-obsidian-950/80 px-3.5 py-2.5 text-sm text-smoke-50"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs text-smoke-300">
              Mobile
            </label>
            <input
              type="text"
              value={contact.phone}
              onChange={(e) => setContact({ ...contact, phone: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-obsidian-950/80 px-3.5 py-2.5 text-sm text-smoke-50"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs text-smoke-300">
              Location
            </label>
            <input
              type="text"
              value={contact.location}
              onChange={(e) =>
                setContact({ ...contact, location: e.target.value })
              }
              className="w-full rounded-xl border border-white/10 bg-obsidian-950/80 px-3.5 py-2.5 text-sm text-smoke-50"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs text-smoke-300">
              LinkedIn URL
            </label>
            <input
              type="url"
              value={contact.linkedinUrl}
              onChange={(e) =>
                setContact({ ...contact, linkedinUrl: e.target.value })
              }
              className="w-full rounded-xl border border-white/10 bg-obsidian-950/80 px-3.5 py-2.5 text-sm text-smoke-50"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs text-smoke-300">
              GitHub URL
            </label>
            <input
              type="url"
              value={contact.githubUrl}
              onChange={(e) =>
                setContact({ ...contact, githubUrl: e.target.value })
              }
              className="w-full rounded-xl border border-white/10 bg-obsidian-950/80 px-3.5 py-2.5 text-sm text-smoke-50"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs text-smoke-300">
              Footer Status Line
            </label>
            <input
              type="text"
              value={footer.statusLine}
              onChange={(e) =>
                setFooter({ ...footer, statusLine: e.target.value })
              }
              className="w-full rounded-xl border border-white/10 bg-obsidian-950/80 px-3.5 py-2.5 text-sm text-smoke-50"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block font-mono text-xs text-smoke-300">
              Footer Tagline
            </label>
            <input
              type="text"
              value={footer.tagline}
              onChange={(e) => setFooter({ ...footer, tagline: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-obsidian-950/80 px-3.5 py-2.5 text-sm text-smoke-50"
            />
          </div>
        </div>
      </section>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-full bg-ember-500 px-6 py-3 text-sm font-semibold text-obsidian-950 shadow-ember hover:bg-ember-400 disabled:opacity-60"
      >
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        <span>Save Profile &amp; Contact Settings</span>
      </button>
    </div>
  );
}
