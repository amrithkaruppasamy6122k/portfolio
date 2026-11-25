import { useState } from 'react';
import { ArrowDown, ArrowUp, Loader2, Plus, Save, Trash2 } from 'lucide-react';
import type { SkillCategory } from '@/types/portfolio';

interface AdminSkillsTabProps {
  categories: SkillCategory[];
  onSave: (next: SkillCategory[]) => Promise<void>;
}

export function AdminSkillsTab({ categories, onSave }: AdminSkillsTabProps) {
  const [items, setItems] = useState<SkillCategory[]>(categories);
  const [saving, setSaving] = useState(false);

  const moveCategory = (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(items);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-smoke-300">
          Add, edit, remove, or reorder skill categories and individual technology
          badges.
        </p>
        <button
          type="button"
          onClick={() =>
            setItems([
              ...items,
              {
                id: `cat-${Date.now()}`,
                title: 'New Category',
                skills: [],
              },
            ])
          }
          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-obsidian-900 px-4 py-2 text-xs font-medium text-smoke-100 hover:border-ember-400/50"
        >
          <Plus className="h-3.5 w-3.5 text-ember-400" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="space-y-4">
        {items.map((cat, catIdx) => (
          <div key={cat.id} className="cinematic-card rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
              <input
                type="text"
                value={cat.title}
                onChange={(e) => {
                  const next = [...items];
                  next[catIdx] = { ...cat, title: e.target.value };
                  setItems(next);
                }}
                className="flex-1 rounded-xl border border-white/10 bg-obsidian-950/80 px-3 py-2 font-display text-lg font-bold uppercase text-smoke-50"
              />
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => moveCategory(catIdx, -1)}
                  aria-label="Move category up"
                  className="rounded-lg border border-white/10 p-2 text-smoke-300 hover:text-smoke-50"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveCategory(catIdx, 1)}
                  aria-label="Move category down"
                  className="rounded-lg border border-white/10 p-2 text-smoke-300 hover:text-smoke-50"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setItems(items.filter((_, idx) => idx !== catIdx))
                  }
                  aria-label="Delete category"
                  className="rounded-lg border border-white/10 p-2 text-smoke-300 hover:border-ember-500/40 hover:text-ember-300"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {cat.skills.map((skill, skillIdx) => (
                <div key={skill.id} className="flex flex-wrap gap-2">
                  <input
                    type="text"
                    value={skill.name}
                    placeholder="Skill Name"
                    onChange={(e) => {
                      const next = [...items];
                      const nextSkills = [...cat.skills];
                      nextSkills[skillIdx] = { ...skill, name: e.target.value };
                      next[catIdx] = { ...cat, skills: nextSkills };
                      setItems(next);
                    }}
                    className="flex-1 rounded-xl border border-white/10 bg-obsidian-950/80 px-3 py-2 text-xs text-smoke-100"
                  />
                  <input
                    type="text"
                    value={skill.logoKey}
                    placeholder="Logo Key (e.g. python, react)"
                    onChange={(e) => {
                      const next = [...items];
                      const nextSkills = [...cat.skills];
                      nextSkills[skillIdx] = {
                        ...skill,
                        logoKey: e.target.value,
                      };
                      next[catIdx] = { ...cat, skills: nextSkills };
                      setItems(next);
                    }}
                    className="w-44 rounded-xl border border-white/10 bg-obsidian-950/80 px-3 py-2 font-mono text-xs text-smoke-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const next = [...items];
                      next[catIdx] = {
                        ...cat,
                        skills: cat.skills.filter((_, i) => i !== skillIdx),
                      };
                      setItems(next);
                    }}
                    aria-label={`Remove ${skill.name}`}
                    className="rounded-xl border border-white/10 p-2 text-smoke-300 hover:border-ember-500/40 hover:text-ember-300"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  const next = [...items];
                  next[catIdx] = {
                    ...cat,
                    skills: [
                      ...cat.skills,
                      {
                        id: `skill-${Date.now()}`,
                        name: 'New Skill',
                        logoKey: 'python',
                      },
                    ],
                  };
                  setItems(next);
                }}
                className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-smoke-200 hover:border-ember-400/50"
              >
                <Plus className="h-3 w-3 text-ember-400" />
                <span>Add Skill</span>
              </button>
            </div>
          </div>
        ))}
      </div>

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
        <span>Save All Skills</span>
      </button>
    </div>
  );
}
