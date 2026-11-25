import { DEFAULT_PORTFOLIO_DATA } from '@/config/portfolio.data';
import { STORAGE_BUCKET, supabase } from '@/lib/supabase';
import type {
  AboutContent,
  AssetConfig,
  CertificateItem,
  ContactDetails,
  FooterContent,
  HeroContent,
  ProjectItem,
  SkillCategory,
} from '@/types/portfolio';

export interface StoredContactMessage {
  id: string;
  full_name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

function requireClient() {
  if (!supabase) {
    throw new Error('Supabase client is not configured.');
  }
  return supabase;
}

export async function signInAdmin(email: string, password: string) {
  const client = requireClient();
  const { data, error } = await client.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOutAdmin() {
  const client = requireClient();
  const { error } = await client.auth.signOut();
  if (error) throw error;
}

export async function checkIsAuthorizedAdmin(): Promise<boolean> {
  if (!supabase) return false;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase.rpc('is_portfolio_admin');
  if (error) return false;
  return Boolean(data);
}

export async function uploadPortfolioFile(
  folder: 'videos' | 'images' | 'documents' | 'projects' | 'certificates',
  file: File
): Promise<string> {
  const client = requireClient();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = `${folder}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await client.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type || undefined,
    });

  if (uploadError) throw uploadError;

  const { data } = client.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}

export async function saveSiteSettings(payload: {
  assets: AssetConfig;
  hero: HeroContent;
  about: AboutContent;
  contact: ContactDetails;
  footer: FooterContent;
}) {
  const client = requireClient();
  const { error } = await client.from('site_settings').upsert(
    {
      id: 1,
      assets: payload.assets,
      hero: payload.hero,
      about: payload.about,
      contact: payload.contact,
      footer: payload.footer,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' }
  );
  if (error) throw error;
}

export async function saveSkillCategories(categories: SkillCategory[]) {
  const client = requireClient();
  const existingIds = categories.map((c) => c.id);

  const { data: currentRows, error: fetchError } = await client
    .from('skill_categories')
    .select('id');
  if (fetchError) throw fetchError;

  const toDelete = (currentRows ?? [])
    .map((r) => r.id as string)
    .filter((id) => !existingIds.includes(id));

  if (toDelete.length > 0) {
    const { error: deleteError } = await client
      .from('skill_categories')
      .delete()
      .in('id', toDelete);
    if (deleteError) throw deleteError;
  }

  const rows = categories.map((cat, idx) => ({
    id: cat.id,
    title: cat.title,
    skills: cat.skills,
    sort_order: idx + 1,
  }));

  if (rows.length > 0) {
    const { error } = await client
      .from('skill_categories')
      .upsert(rows, { onConflict: 'id' });
    if (error) throw error;
  }
}

export async function upsertProject(project: ProjectItem) {
  const client = requireClient();
  const { error } = await client.from('projects').upsert(
    {
      id: project.id,
      title: project.title,
      description: project.description,
      features: project.features,
      technologies: project.technologies,
      github_url: project.githubUrl || null,
      live_url: project.liveUrl || null,
      image_url: project.imageUrl || null,
      sort_order: project.sortOrder,
    },
    { onConflict: 'id' }
  );
  if (error) throw error;
}

export async function reorderProjects(projects: ProjectItem[]) {
  const client = requireClient();
  const rows = projects.map((p, idx) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    features: p.features,
    technologies: p.technologies,
    github_url: p.githubUrl || null,
    live_url: p.liveUrl || null,
    image_url: p.imageUrl || null,
    sort_order: idx + 1,
  }));
  const { error } = await client.from('projects').upsert(rows, { onConflict: 'id' });
  if (error) throw error;
}

export async function deleteProject(id: string) {
  const client = requireClient();
  const { error } = await client.from('projects').delete().eq('id', id);
  if (error) throw error;
}

export async function upsertCertificate(certificate: CertificateItem) {
  const client = requireClient();
  const { error } = await client.from('certificates').upsert(
    {
      id: certificate.id,
      title: certificate.title,
      platform: certificate.platform,
      status: certificate.status,
      completion_date: certificate.completionDate || null,
      certificate_url: certificate.certificateUrl || null,
      preview_url: certificate.previewUrl || null,
      featured: Boolean(certificate.featured),
      sort_order: certificate.sortOrder,
    },
    { onConflict: 'id' }
  );
  if (error) throw error;
}

export async function reorderCertificates(certificates: CertificateItem[]) {
  const client = requireClient();
  const rows = certificates.map((c, idx) => ({
    id: c.id,
    title: c.title,
    platform: c.platform,
    status: c.status,
    completion_date: c.completionDate || null,
    certificate_url: c.certificateUrl || null,
    preview_url: c.previewUrl || null,
    featured: Boolean(c.featured),
    sort_order: idx + 1,
  }));
  const { error } = await client
    .from('certificates')
    .upsert(rows, { onConflict: 'id' });
  if (error) throw error;
}

export async function deleteCertificate(id: string) {
  const client = requireClient();
  const { error } = await client.from('certificates').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchContactMessages(): Promise<StoredContactMessage[]> {
  const client = requireClient();
  const { data, error } = await client
    .from('contact_messages')
    .select('id, full_name, email, subject, message, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as StoredContactMessage[];
}

export async function deleteContactMessage(id: string) {
  const client = requireClient();
  const { error } = await client.from('contact_messages').delete().eq('id', id);
  if (error) throw error;
}

export async function seedInitialPortfolioDatabase() {
  await saveSiteSettings({
    assets: DEFAULT_PORTFOLIO_DATA.assets,
    hero: DEFAULT_PORTFOLIO_DATA.hero,
    about: DEFAULT_PORTFOLIO_DATA.about,
    contact: DEFAULT_PORTFOLIO_DATA.contact,
    footer: DEFAULT_PORTFOLIO_DATA.footer,
  });
  await saveSkillCategories(DEFAULT_PORTFOLIO_DATA.skillCategories);
  await reorderProjects(DEFAULT_PORTFOLIO_DATA.projects);
  await reorderCertificates(DEFAULT_PORTFOLIO_DATA.certificates);
}
