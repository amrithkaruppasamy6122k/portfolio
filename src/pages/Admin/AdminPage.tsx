import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  Award,
  Briefcase,
  CheckCircle2,
  Cpu,
  Database,
  Film,
  Loader2,
  LogOut,
  Mail,
  ShieldAlert,
  User,
} from 'lucide-react';
import { AdminCertificatesTab } from '@/components/admin/AdminCertificatesTab';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminMediaTab } from '@/components/admin/AdminMediaTab';
import { AdminMessagesTab } from '@/components/admin/AdminMessagesTab';
import { AdminProfileTab } from '@/components/admin/AdminProfileTab';
import { AdminProjectsTab } from '@/components/admin/AdminProjectsTab';
import { AdminSkillsTab } from '@/components/admin/AdminSkillsTab';
import { AmbientBackground } from '@/components/common/AmbientBackground';
import { DEFAULT_ASSETS } from '@/config/assets.config';
import { DEFAULT_PORTFOLIO_DATA } from '@/config/portfolio.data';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import {
  checkIsAuthorizedAdmin,
  saveSiteSettings,
  saveSkillCategories,
  seedInitialPortfolioDatabase,
  signOutAdmin,
} from '@/services/adminService';
import { fetchPortfolioData } from '@/services/portfolioService';
import type { PortfolioData } from '@/types/portfolio';

type AdminTab =
  | 'profile'
  | 'media'
  | 'skills'
  | 'projects'
  | 'certificates'
  | 'messages';

export function AdminPage() {
  const [authStatus, setAuthStatus] = useState<
    'checking' | 'unconfigured' | 'unauthenticated' | 'unauthorized' | 'authorized'
  >(() => (isSupabaseConfigured ? 'checking' : 'unconfigured'));

  const [portfolioData, setPortfolioData] = useState<PortfolioData>(
    DEFAULT_PORTFOLIO_DATA
  );
  const [activeTab, setActiveTab] = useState<AdminTab>('profile');
  const [notice, setNotice] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [seeding, setSeeding] = useState(false);

  const verifyAuthAndLoad = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setAuthStatus('unconfigured');
      return;
    }

    setAuthStatus('checking');
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setAuthStatus('unauthenticated');
      return;
    }

    const isAdmin = await checkIsAuthorizedAdmin();
    if (!isAdmin) {
      setAuthStatus('unauthorized');
      return;
    }

    const loaded = await fetchPortfolioData();
    setPortfolioData(loaded);
    setAuthStatus('authorized');
  }, []);

  useEffect(() => {
    verifyAuthAndLoad();

    if (!supabase) return;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      verifyAuthAndLoad();
    });
    return () => subscription.unsubscribe();
  }, [verifyAuthAndLoad]);

  const showNotice = (type: 'success' | 'error', message: string) => {
    setNotice({ type, message });
    window.setTimeout(() => {
      setNotice((prev) => (prev?.message === message ? null : prev));
    }, 4500);
  };

  const handleSeedDatabase = async () => {
    setSeeding(true);
    try {
      await seedInitialPortfolioDatabase();
      const loaded = await fetchPortfolioData();
      setPortfolioData(loaded);
      showNotice(
        'success',
        'Default portfolio data seeded to Supabase successfully.'
      );
    } catch (err) {
      showNotice(
        'error',
        err instanceof Error ? err.message : 'Failed to seed database.'
      );
    } finally {
      setSeeding(false);
    }
  };

  if (authStatus === 'unconfigured') {
    return (
      <div className="relative isolate flex min-h-screen items-center justify-center bg-obsidian-950 px-5 py-16">
        <AmbientBackground imageSrc={DEFAULT_ASSETS.backgroundImage} />
        <div className="cinematic-card relative z-10 w-full max-w-xl rounded-2xl p-8">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-ember-500/35 bg-ember-500/10 text-ember-400">
            <Database className="h-5 w-5" aria-hidden="true" />
          </div>
          <h1 className="text-center font-display text-3xl font-bold uppercase tracking-wide text-smoke-50">
            Supabase Configuration Required
          </h1>
          <p className="mt-3 text-center text-sm leading-relaxed text-smoke-300">
            The Admin Dashboard uses Supabase Authentication, Row Level Security,
            and Storage. Add your credentials to unlock private editing:
          </p>
          <ol className="mt-5 list-decimal space-y-2 pl-5 text-xs leading-relaxed text-smoke-200">
            <li>
              Copy <code className="font-mono text-ember-300">.env.example</code>{' '}
              to <code className="font-mono text-ember-300">.env</code> and set{' '}
              <code className="font-mono text-ember-300">VITE_SUPABASE_URL</code>{' '}
              and{' '}
              <code className="font-mono text-ember-300">
                VITE_SUPABASE_ANON_KEY
              </code>
              .
            </li>
            <li>
              Execute{' '}
              <code className="font-mono text-ember-300">
                supabase/schema.sql
              </code>{' '}
              in your Supabase SQL Editor.
            </li>
            <li>
              Create your single admin account in Supabase Auth (with public
              signups disabled) and insert your email into{' '}
              <code className="font-mono text-ember-300">public.admin_users</code>
              .
            </li>
          </ol>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-obsidian-900 px-5 py-2.5 text-xs font-medium uppercase tracking-widest text-smoke-100 hover:border-ember-400/50"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-ember-400" />
              <span>Return to Portfolio</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (authStatus === 'checking') {
    return (
      <div className="relative isolate flex min-h-screen items-center justify-center bg-obsidian-950">
        <AmbientBackground imageSrc={DEFAULT_ASSETS.backgroundImage} />
        <Loader2 className="relative z-10 h-8 w-8 animate-spin text-ember-400" />
      </div>
    );
  }

  if (authStatus === 'unauthenticated') {
    return (
      <div className="relative isolate flex min-h-screen items-center justify-center bg-obsidian-950 px-5 py-16">
        <AmbientBackground imageSrc={DEFAULT_ASSETS.backgroundImage} />
        <AdminLogin onSuccess={verifyAuthAndLoad} />
      </div>
    );
  }

  if (authStatus === 'unauthorized') {
    return (
      <div className="relative isolate flex min-h-screen items-center justify-center bg-obsidian-950 px-5 py-16">
        <AmbientBackground imageSrc={DEFAULT_ASSETS.backgroundImage} />
        <div className="cinematic-card relative z-10 w-full max-w-md rounded-2xl p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-ember-500/35 bg-ember-500/10 text-ember-400">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <h1 className="font-display text-3xl font-bold uppercase text-smoke-50">
            Access Denied
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-smoke-300">
            This account is not listed in{' '}
            <code className="font-mono text-ember-300">public.admin_users</code>.
            Write access is enforced by Supabase Row Level Security.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => signOutAdmin()}
              className="rounded-full bg-ember-500 px-5 py-2.5 text-xs font-semibold text-obsidian-950"
            >
              Sign Out
            </button>
            <Link
              to="/"
              className="rounded-full border border-white/15 px-5 py-2.5 text-xs text-smoke-100"
            >
              Portfolio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tabs: Array<{ id: AdminTab; label: string; icon: typeof User }> = [
    { id: 'profile', label: 'Profile & Contact', icon: User },
    { id: 'media', label: 'Media & CV', icon: Film },
    { id: 'skills', label: 'Skills', icon: Cpu },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'certificates', label: 'Certifications', icon: Award },
    { id: 'messages', label: 'Messages', icon: Mail },
  ];

  return (
    <div className="relative isolate min-h-screen bg-obsidian-950 px-5 py-10 text-smoke-50 sm:px-8">
      <AmbientBackground imageSrc={portfolioData.assets.backgroundImage} />

      <div className="relative z-10 mx-auto max-w-6xl space-y-6">
        <header className="cinematic-card flex flex-wrap items-center justify-between gap-4 rounded-2xl p-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-ember-400">
              Private CMS
            </p>
            <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-smoke-50">
              Portfolio Admin Dashboard
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleSeedDatabase}
              disabled={seeding}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-obsidian-900 px-4 py-2 text-xs font-medium text-smoke-100 hover:border-ember-400/50 disabled:opacity-60"
            >
              {seeding ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-ember-400" />
              ) : (
                <Database className="h-3.5 w-3.5 text-ember-400" />
              )}
              <span>Seed Default Content</span>
            </button>

            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-obsidian-900 px-4 py-2 text-xs font-medium text-smoke-100 hover:border-ember-400/50"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-ember-400" />
              <span>View Live Site</span>
            </Link>

            <button
              type="button"
              onClick={() => signOutAdmin()}
              className="inline-flex items-center gap-2 rounded-full border border-ember-500/40 bg-ember-500/10 px-4 py-2 text-xs font-medium text-ember-200 hover:bg-ember-500/20"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {notice && (
          <div
            role="status"
            className={`flex items-center gap-2.5 rounded-xl border p-4 text-xs ${
              notice.type === 'success'
                ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-200'
                : 'border-ember-500/40 bg-ember-500/10 text-ember-200'
            }`}
          >
            {notice.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0 text-ember-400" />
            )}
            <span>{notice.message}</span>
          </div>
        )}

        <nav
          aria-label="Admin sections"
          className="flex flex-wrap gap-2"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                  active
                    ? 'border-ember-500/60 bg-ember-500/20 text-ember-300'
                    : 'border-white/10 bg-obsidian-900/75 text-smoke-300 hover:border-white/25 hover:text-smoke-100'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {activeTab === 'profile' && (
          <AdminProfileTab
            data={portfolioData}
            onSave={async (next) => {
              try {
                await saveSiteSettings({
                  assets: portfolioData.assets,
                  ...next,
                });
                setPortfolioData((prev) => ({ ...prev, ...next }));
                showNotice('success', 'Profile, About, Contact & Footer saved.');
              } catch (err) {
                showNotice(
                  'error',
                  err instanceof Error ? err.message : 'Save failed.'
                );
              }
            }}
          />
        )}

        {activeTab === 'media' && (
          <AdminMediaTab
            assets={portfolioData.assets}
            onSave={async (nextAssets) => {
              try {
                await saveSiteSettings({
                  assets: nextAssets,
                  hero: portfolioData.hero,
                  about: portfolioData.about,
                  contact: portfolioData.contact,
                  footer: portfolioData.footer,
                });
                setPortfolioData((prev) => ({ ...prev, assets: nextAssets }));
                showNotice('success', 'Media & CV paths updated.');
              } catch (err) {
                showNotice(
                  'error',
                  err instanceof Error ? err.message : 'Failed to save media.'
                );
              }
            }}
          />
        )}

        {activeTab === 'skills' && (
          <AdminSkillsTab
            categories={portfolioData.skillCategories}
            onSave={async (nextCategories) => {
              try {
                await saveSkillCategories(nextCategories);
                setPortfolioData((prev) => ({
                  ...prev,
                  skillCategories: nextCategories,
                }));
                showNotice('success', 'Skills & categories updated.');
              } catch (err) {
                showNotice(
                  'error',
                  err instanceof Error ? err.message : 'Failed to save skills.'
                );
              }
            }}
          />
        )}

        {activeTab === 'projects' && (
          <AdminProjectsTab
            projects={portfolioData.projects}
            onChange={(nextProjects) =>
              setPortfolioData((prev) => ({ ...prev, projects: nextProjects }))
            }
            onNotify={(msg) => showNotice('success', msg)}
          />
        )}

        {activeTab === 'certificates' && (
          <AdminCertificatesTab
            certificates={portfolioData.certificates}
            onChange={(nextCerts) =>
              setPortfolioData((prev) => ({ ...prev, certificates: nextCerts }))
            }
            onNotify={(msg) => showNotice('success', msg)}
          />
        )}

        {activeTab === 'messages' && <AdminMessagesTab />}
      </div>
    </div>
  );
}
