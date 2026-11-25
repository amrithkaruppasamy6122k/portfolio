import { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Loader2,
  Plus,
  Save,
  Trash2,
  Upload,
} from 'lucide-react';
import {
  deleteProject,
  reorderProjects,
  uploadPortfolioFile,
  upsertProject,
} from '@/services/adminService';
import type { ProjectItem } from '@/types/portfolio';

interface AdminProjectsTabProps {
  projects: ProjectItem[];
  onChange: (next: ProjectItem[]) => void;
  onNotify: (msg: string) => void;
}

export function AdminProjectsTab({
  projects,
  onChange,
  onNotify,
}: AdminProjectsTabProps) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const sorted = [...projects].sort((a, b) => a.sortOrder - b.sortOrder);

  const handleField = (
    index: number,
    patch: Partial<ProjectItem>
  ) => {
    const next = [...sorted];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  const handleSaveOne = async (project: ProjectItem) => {
    setBusyId(project.id);
    try {
      await upsertProject(project);
      onNotify(`Saved "${project.title}".`);
    } finally {
      setBusyId(null);
    }
  };

  const handleDeleteOne = async (id: string) => {
    setBusyId(id);
    try {
      await deleteProject(id);
      onChange(sorted.filter((p) => p.id !== id));
      onNotify('Project deleted.');
    } finally {
      setBusyId(null);
    }
  };

  const handleMove = async (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= sorted.length) return;
    const next = [...sorted];
    [next[index], next[target]] = [next[target], next[index]];
    const reindexed = next.map((p, idx) => ({ ...p, sortOrder: idx + 1 }));
    onChange(reindexed);
    await reorderProjects(reindexed);
    onNotify('Project order updated.');
  };

  const handleAdd = () => {
    const newProject: ProjectItem = {
      id: `project-${Date.now()}`,
      title: 'New Project',
      description: 'Project description...',
      features: ['Core feature'],
      technologies: [],
      sortOrder: sorted.length + 1,
    };
    onChange([...sorted, newProject]);
  };

  const handleImageUpload = async (index: number, file?: File) => {
    if (!file) return;
    const project = sorted[index];
    setBusyId(project.id);
    try {
      const url = await uploadPortfolioFile('projects', file);
      handleField(index, { imageUrl: url });
      onNotify('Project image uploaded. Click Save to persist.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-smoke-300">
          Manage projects, images, technologies, GitHub/Live Demo links, and
          display order.
        </p>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-obsidian-900 px-4 py-2 text-xs font-medium text-smoke-100 hover:border-ember-400/50"
        >
          <Plus className="h-3.5 w-3.5 text-ember-400" />
          <span>Add Project</span>
        </button>
      </div>

      {sorted.map((project, index) => (
        <div key={project.id} className="cinematic-card space-y-4 rounded-2xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
            <span className="font-mono text-xs text-ember-400">
              #{String(index + 1).padStart(2, '0')}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleMove(index, -1)}
                aria-label="Move project up"
                className="rounded-lg border border-white/10 p-2 text-smoke-300 hover:text-smoke-50"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleMove(index, 1)}
                aria-label="Move project down"
                className="rounded-lg border border-white/10 p-2 text-smoke-300 hover:text-smoke-50"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleDeleteOne(project.id)}
                disabled={busyId === project.id}
                aria-label={`Delete ${project.title}`}
                className="rounded-lg border border-white/10 p-2 text-smoke-300 hover:border-ember-500/40 hover:text-ember-300"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block font-mono text-xs text-smoke-300">
                Project Title
              </label>
              <input
                type="text"
                value={project.title}
                onChange={(e) => handleField(index, { title: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-obsidian-950/80 px-3.5 py-2.5 text-sm text-smoke-50"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block font-mono text-xs text-smoke-300">
                Description
              </label>
              <textarea
                rows={2}
                value={project.description}
                onChange={(e) =>
                  handleField(index, { description: e.target.value })
                }
                className="w-full rounded-xl border border-white/10 bg-obsidian-950/80 px-3.5 py-2.5 text-sm text-smoke-50"
              />
            </div>

            <div>
              <label className="mb-1 block font-mono text-xs text-smoke-300">
                Features (one per line)
              </label>
              <textarea
                rows={4}
                value={project.features.join('\n')}
                onChange={(e) =>
                  handleField(index, {
                    features: e.target.value
                      .split('\n')
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                className="w-full rounded-xl border border-white/10 bg-obsidian-950/80 px-3.5 py-2.5 text-xs text-smoke-100"
              />
            </div>

            <div>
              <label className="mb-1 block font-mono text-xs text-smoke-300">
                Technologies (comma-separated)
              </label>
              <textarea
                rows={4}
                value={project.technologies.join(', ')}
                onChange={(e) =>
                  handleField(index, {
                    technologies: e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="React, FastAPI, PostgreSQL"
                className="w-full rounded-xl border border-white/10 bg-obsidian-950/80 px-3.5 py-2.5 text-xs text-smoke-100"
              />
            </div>

            <div>
              <label className="mb-1 block font-mono text-xs text-smoke-300">
                GitHub URL (optional)
              </label>
              <input
                type="url"
                value={project.githubUrl ?? ''}
                onChange={(e) =>
                  handleField(index, { githubUrl: e.target.value || undefined })
                }
                className="w-full rounded-xl border border-white/10 bg-obsidian-950/80 px-3.5 py-2.5 text-xs text-smoke-100"
              />
            </div>

            <div>
              <label className="mb-1 block font-mono text-xs text-smoke-300">
                Live Demo URL (optional)
              </label>
              <input
                type="url"
                value={project.liveUrl ?? ''}
                onChange={(e) =>
                  handleField(index, { liveUrl: e.target.value || undefined })
                }
                className="w-full rounded-xl border border-white/10 bg-obsidian-950/80 px-3.5 py-2.5 text-xs text-smoke-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block font-mono text-xs text-smoke-300">
                Project Image URL
              </label>
              <div className="flex flex-wrap gap-2">
                <input
                  type="text"
                  value={project.imageUrl ?? ''}
                  onChange={(e) =>
                    handleField(index, { imageUrl: e.target.value || undefined })
                  }
                  className="flex-1 rounded-xl border border-white/10 bg-obsidian-950/80 px-3.5 py-2.5 font-mono text-xs text-smoke-100"
                />
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/15 bg-obsidian-900 px-4 py-2 text-xs text-smoke-100 hover:border-ember-400/50">
                  <Upload className="h-3.5 w-3.5 text-ember-400" />
                  <span>Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleImageUpload(index, e.target.files?.[0])
                    }
                  />
                </label>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSaveOne(project)}
            disabled={busyId === project.id}
            className="inline-flex items-center gap-2 rounded-full bg-ember-500 px-5 py-2.5 text-xs font-semibold text-obsidian-950 hover:bg-ember-400 disabled:opacity-60"
          >
            {busyId === project.id ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            <span>Save Project</span>
          </button>
        </div>
      ))}
    </div>
  );
}
