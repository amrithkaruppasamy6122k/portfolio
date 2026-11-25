import { useState } from 'react';
import { FileText, Film, Image, Loader2, Save, Upload } from 'lucide-react';
import { uploadPortfolioFile } from '@/services/adminService';
import type { AssetConfig } from '@/types/portfolio';

interface AdminMediaTabProps {
  assets: AssetConfig;
  onSave: (nextAssets: AssetConfig) => Promise<void>;
}

export function AdminMediaTab({ assets, onSave }: AdminMediaTabProps) {
  const [form, setForm] = useState<AssetConfig>(assets);
  const [uploadingKey, setUploadingKey] = useState<keyof AssetConfig | null>(null);
  const [saving, setSaving] = useState(false);

  const handleUpload = async (
    key: keyof AssetConfig,
    folder: 'videos' | 'images' | 'documents',
    file?: File
  ) => {
    if (!file) return;
    setUploadingKey(key);
    try {
      const publicUrl = await uploadPortfolioFile(folder, file);
      setForm((prev) => ({ ...prev, [key]: publicUrl }));
    } finally {
      setUploadingKey(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  const items: Array<{
    key: keyof AssetConfig;
    label: string;
    folder: 'videos' | 'images' | 'documents';
    accept: string;
    icon: typeof Film;
  }> = [
    {
      key: 'introVideo',
      label: 'Intro Video (.mp4 / .webm)',
      folder: 'videos',
      accept: 'video/mp4,video/webm',
      icon: Film,
    },
    {
      key: 'aboutVideo',
      label: 'About Me Video (.mp4 / .webm)',
      folder: 'videos',
      accept: 'video/mp4,video/webm',
      icon: Film,
    },
    {
      key: 'backgroundImage',
      label: 'Background Image (.jpg / .png / .webp)',
      folder: 'images',
      accept: 'image/*',
      icon: Image,
    },
    {
      key: 'resumePdf',
      label: 'Resume / CV (.pdf)',
      folder: 'documents',
      accept: 'application/pdf',
      icon: FileText,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isUploading = uploadingKey === item.key;

          return (
            <div key={item.key} className="cinematic-card rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-obsidian-900 text-ember-400">
                  <Icon className="h-4 w-4" />
                </span>
                <h3 className="font-display text-xl font-bold uppercase tracking-wide text-smoke-50">
                  {item.label}
                </h3>
              </div>

              <div className="mt-4 space-y-3">
                <input
                  type="text"
                  value={form[item.key]}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, [item.key]: e.target.value }))
                  }
                  className="w-full rounded-xl border border-white/10 bg-obsidian-950/80 px-3.5 py-2.5 font-mono text-xs text-smoke-100"
                />

                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-obsidian-900 px-4 py-2 text-xs font-medium text-smoke-100 hover:border-ember-400/50">
                  {isUploading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-ember-400" />
                  ) : (
                    <Upload className="h-3.5 w-3.5 text-ember-400" />
                  )}
                  <span>{isUploading ? 'Uploading...' : 'Upload New File'}</span>
                  <input
                    type="file"
                    accept={item.accept}
                    className="hidden"
                    disabled={isUploading}
                    onChange={(e) =>
                      handleUpload(item.key, item.folder, e.target.files?.[0])
                    }
                  />
                </label>
              </div>
            </div>
          );
        })}
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
        <span>Save Media Paths</span>
      </button>
    </div>
  );
}
