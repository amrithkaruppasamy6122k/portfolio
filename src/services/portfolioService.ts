import { DEFAULT_PORTFOLIO_DATA } from '@/config/portfolio.data';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type {
  CertificateItem,
  ContactMessagePayload,
  PortfolioData,
  ProjectItem,
  SkillCategory,
} from '@/types/portfolio';

export async function fetchPortfolioData(): Promise<PortfolioData> {
  if (!isSupabaseConfigured || !supabase) {
    return DEFAULT_PORTFOLIO_DATA;
  }

  try {
    const [settingsRes, skillsRes, projectsRes, certsRes] = await Promise.all([
      supabase
        .from('site_settings')
        .select('assets, hero, about, contact, footer')
        .eq('id', 1)
        .maybeSingle(),
      supabase
        .from('skill_categories')
        .select('id, title, skills, sort_order')
        .order('sort_order', { ascending: true }),
      supabase
        .from('projects')
        .select(
          'id, title, description, features, technologies, github_url, live_url, image_url, sort_order'
        )
        .order('sort_order', { ascending: true }),
      supabase
        .from('certificates')
        .select(
          'id, title, platform, status, completion_date, certificate_url, preview_url, featured, sort_order'
        )
        .order('sort_order', { ascending: true }),
    ]);

    const settings = settingsRes.data;
    const skillRows = skillsRes.data;
    const projectRows = projectsRes.data;
    const certRows = certsRes.data;

    const skillCategories: SkillCategory[] =
      skillRows && skillRows.length > 0
        ? skillRows.map((row) => ({
            id: row.id,
            title: row.title,
            skills: Array.isArray(row.skills) ? row.skills : [],
          }))
        : DEFAULT_PORTFOLIO_DATA.skillCategories;

    const projects: ProjectItem[] =
      projectRows && projectRows.length > 0
        ? projectRows.map((row) => ({
            id: row.id,
            title: row.title,
            description: row.description,
            features: Array.isArray(row.features) ? row.features : [],
            technologies: Array.isArray(row.technologies) ? row.technologies : [],
            githubUrl: row.github_url ?? undefined,
            liveUrl: row.live_url ?? undefined,
            imageUrl: row.image_url ?? undefined,
            sortOrder: row.sort_order ?? 0,
          }))
        : DEFAULT_PORTFOLIO_DATA.projects;

    const certificates: CertificateItem[] =
      certRows && certRows.length > 0
        ? certRows.map((row) => ({
            id: row.id,
            title: row.title,
            platform: row.platform,
            status: 'Completed',
            completionDate: row.completion_date ?? undefined,
            certificateUrl: row.certificate_url ?? undefined,
            previewUrl: row.preview_url ?? undefined,
            featured: Boolean(row.featured),
            sortOrder: row.sort_order ?? 0,
          }))
        : DEFAULT_PORTFOLIO_DATA.certificates;

    return {
      assets: {
        ...DEFAULT_PORTFOLIO_DATA.assets,
        ...(settings?.assets ?? {}),
      },
      hero: {
        ...DEFAULT_PORTFOLIO_DATA.hero,
        ...(settings?.hero ?? {}),
      },
      about: {
        ...DEFAULT_PORTFOLIO_DATA.about,
        ...(settings?.about ?? {}),
      },
      contact: {
        ...DEFAULT_PORTFOLIO_DATA.contact,
        ...(settings?.contact ?? {}),
      },
      footer: {
        ...DEFAULT_PORTFOLIO_DATA.footer,
        ...(settings?.footer ?? {}),
      },
      skillCategories,
      projects,
      certificates,
    };
  } catch {
    return DEFAULT_PORTFOLIO_DATA;
  }
}

export async function submitContactMessage(
  payload: ContactMessagePayload
): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      ok: false,
      error:
        'Backend email delivery is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env and deploy the send-contact-email Edge Function, or email Amrithkaruppasamy1@gmail.com directly.',
    };
  }

  const functionName =
    import.meta.env.VITE_CONTACT_FUNCTION_NAME?.trim() || 'send-contact-email';

  const { data, error } = await supabase.functions.invoke<{
    ok?: boolean;
    error?: string;
  }>(functionName, {
    body: payload,
  });

  if (error) {
    return {
      ok: false,
      error:
        error.message ||
        'Unable to reach the email delivery service. Please try again or email directly.',
    };
  }

  if (!data?.ok) {
    return {
      ok: false,
      error:
        data?.error ||
        'Email service did not confirm delivery. Please reach out directly via email.',
    };
  }

  return { ok: true };
}
