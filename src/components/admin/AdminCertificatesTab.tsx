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
  deleteCertificate,
  reorderCertificates,
  uploadPortfolioFile,
  upsertCertificate,
} from '@/services/adminService';
import type { CertificateItem } from '@/types/portfolio';

interface AdminCertificatesTabProps {
  certificates: CertificateItem[];
  onChange: (next: CertificateItem[]) => void;
  onNotify: (msg: string) => void;
}

export function AdminCertificatesTab({
  certificates,
  onChange,
  onNotify,
}: AdminCertificatesTabProps) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const sorted = [...certificates].sort((a, b) => a.sortOrder - b.sortOrder);

  const handleField = (index: number, patch: Partial<CertificateItem>) => {
    const next = [...sorted];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  const handleSaveOne = async (cert: CertificateItem) => {
    setBusyId(cert.id);
    try {
      await upsertCertificate(cert);
      onNotify(`Saved "${cert.title}".`);
    } finally {
      setBusyId(null);
    }
  };

  const handleDeleteOne = async (id: string) => {
    setBusyId(id);
    try {
      await deleteCertificate(id);
      onChange(sorted.filter((c) => c.id !== id));
      onNotify('Certificate deleted.');
    } finally {
      setBusyId(null);
    }
  };

  const handleMove = async (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= sorted.length) return;
    const next = [...sorted];
    [next[index], next[target]] = [next[target], next[index]];
    const reindexed = next.map((c, idx) => ({ ...c, sortOrder: idx + 1 }));
    onChange(reindexed);
    await reorderCertificates(reindexed);
    onNotify('Certificate order updated.');
  };

  const handleAdd = () => {
    onChange([
      ...sorted,
      {
        id: `cert-${Date.now()}`,
        title: 'New Certification',
        platform: 'Learning Platform',
        status: 'Completed',
        featured: false,
        sortOrder: sorted.length + 1,
      },
    ]);
  };

  const handleFileUpload = async (index: number, file?: File) => {
    if (!file) return;
    const cert = sorted[index];
    setBusyId(cert.id);
    try {
      const url = await uploadPortfolioFile('certificates', file);
      handleField(index, { previewUrl: url });
      onNotify('Certificate file uploaded. Click Save Certificate to persist.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-smoke-300">
          Add, edit, delete, reorder, or upload certificate images and PDFs.
        </p>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-obsidian-900 px-4 py-2 text-xs font-medium text-smoke-100 hover:border-ember-400/50"
        >
          <Plus className="h-3.5 w-3.5 text-ember-400" />
          <span>Add Certificate</span>
        </button>
      </div>

      {sorted.map((cert, index) => (
        <div key={cert.id} className="cinematic-card space-y-4 rounded-2xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
            <label className="inline-flex items-center gap-2 text-xs text-smoke-200">
              <input
                type="checkbox"
                checked={Boolean(cert.featured)}
                onChange={(e) =>
                  handleField(index, { featured: e.target.checked })
                }
                className="accent-ember-500"
              />
              <span>Featured large Bento card</span>
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleMove(index, -1)}
                aria-label="Move certificate up"
                className="rounded-lg border border-white/10 p-2 text-smoke-300 hover:text-smoke-50"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleMove(index, 1)}
                aria-label="Move certificate down"
                className="rounded-lg border border-white/10 p-2 text-smoke-300 hover:text-smoke-50"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleDeleteOne(cert.id)}
                disabled={busyId === cert.id}
                aria-label={`Delete ${cert.title}`}
                className="rounded-lg border border-white/10 p-2 text-smoke-300 hover:border-ember-500/40 hover:text-ember-300"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-mono text-xs text-smoke-300">
                Certificate Title
              </label>
              <input
                type="text"
                value={cert.title}
                onChange={(e) => handleField(index, { title: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-obsidian-950/80 px-3.5 py-2.5 text-sm text-smoke-50"
              />
            </div>
            <div>
              <label className="mb-1 block font-mono text-xs text-smoke-300">
                Platform
              </label>
              <input
                type="text"
                value={cert.platform}
                onChange={(e) => handleField(index, { platform: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-obsidian-950/80 px-3.5 py-2.5 text-sm text-smoke-50"
              />
            </div>
            <div>
              <label className="mb-1 block font-mono text-xs text-smoke-300">
                Completion Date (optional)
              </label>
              <input
                type="text"
                value={cert.completionDate ?? ''}
                placeholder="e.g. Jan 2026"
                onChange={(e) =>
                  handleField(index, {
                    completionDate: e.target.value || undefined,
                  })
                }
                className="w-full rounded-xl border border-white/10 bg-obsidian-950/80 px-3.5 py-2.5 text-xs text-smoke-100"
              />
            </div>
            <div>
              <label className="mb-1 block font-mono text-xs text-smoke-300">
                Certificate Credential URL (optional)
              </label>
              <input
                type="url"
                value={cert.certificateUrl ?? ''}
                onChange={(e) =>
                  handleField(index, {
                    certificateUrl: e.target.value || undefined,
                  })
                }
                className="w-full rounded-xl border border-white/10 bg-obsidian-950/80 px-3.5 py-2.5 text-xs text-smoke-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block font-mono text-xs text-smoke-300">
                Preview Image or PDF URL
              </label>
              <div className="flex flex-wrap gap-2">
                <input
                  type="text"
                  value={cert.previewUrl ?? ''}
                  onChange={(e) =>
                    handleField(index, { previewUrl: e.target.value || undefined })
                  }
                  className="flex-1 rounded-xl border border-white/10 bg-obsidian-950/80 px-3.5 py-2.5 font-mono text-xs text-smoke-100"
                />
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/15 bg-obsidian-900 px-4 py-2 text-xs text-smoke-100 hover:border-ember-400/50">
                  <Upload className="h-3.5 w-3.5 text-ember-400" />
                  <span>Upload Image / PDF</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) =>
                      handleFileUpload(index, e.target.files?.[0])
                    }
                  />
                </label>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSaveOne(cert)}
            disabled={busyId === cert.id}
            className="inline-flex items-center gap-2 rounded-full bg-ember-500 px-5 py-2.5 text-xs font-semibold text-obsidian-950 hover:bg-ember-400 disabled:opacity-60"
          >
            {busyId === cert.id ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            <span>Save Certificate</span>
          </button>
        </div>
      ))}
    </div>
  );
}
