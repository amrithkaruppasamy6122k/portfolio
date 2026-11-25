-- =============================================================================
-- AMRITH PORTFOLIO — SUPABASE SCHEMA, RLS POLICIES & STORAGE SETUP
-- =============================================================================

create extension if not exists "pgcrypto";

-- 1. Authorized Administrator Registry
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete cascade,
  email text unique not null,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

drop policy if exists "Admins can view their own admin record" on public.admin_users;
create policy "Admins can view their own admin record"
  on public.admin_users
  for select
  to authenticated
  using (
    user_id = auth.uid()
    or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

-- Helper function enforced by all admin RLS policies
create or replace function public.is_portfolio_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
       or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

grant execute on function public.is_portfolio_admin() to anon, authenticated;

-- 2. Site Settings (Hero, About, Assets, Contact, Footer)
create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  assets jsonb not null default '{}'::jsonb,
  hero jsonb not null default '{}'::jsonb,
  about jsonb not null default '{}'::jsonb,
  contact jsonb not null default '{}'::jsonb,
  footer jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "Public read access to site_settings" on public.site_settings;
create policy "Public read access to site_settings"
  on public.site_settings
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Admin write access to site_settings" on public.site_settings;
create policy "Admin write access to site_settings"
  on public.site_settings
  for all
  to authenticated
  using (public.is_portfolio_admin())
  with check (public.is_portfolio_admin());

-- 3. Skill Categories
create table if not exists public.skill_categories (
  id text primary key,
  title text not null,
  skills jsonb not null default '[]'::jsonb,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.skill_categories enable row level security;

drop policy if exists "Public read access to skill_categories" on public.skill_categories;
create policy "Public read access to skill_categories"
  on public.skill_categories
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Admin write access to skill_categories" on public.skill_categories;
create policy "Admin write access to skill_categories"
  on public.skill_categories
  for all
  to authenticated
  using (public.is_portfolio_admin())
  with check (public.is_portfolio_admin());

-- 4. Featured Projects
create table if not exists public.projects (
  id text primary key,
  title text not null,
  description text not null,
  features text[] not null default '{}',
  technologies text[] not null default '{}',
  github_url text,
  live_url text,
  image_url text,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.projects enable row level security;

drop policy if exists "Public read access to projects" on public.projects;
create policy "Public read access to projects"
  on public.projects
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Admin write access to projects" on public.projects;
create policy "Admin write access to projects"
  on public.projects
  for all
  to authenticated
  using (public.is_portfolio_admin())
  with check (public.is_portfolio_admin());

-- 5. Certifications & Professional Learning
create table if not exists public.certificates (
  id text primary key,
  title text not null,
  platform text not null,
  status text not null default 'Completed',
  completion_date text,
  certificate_url text,
  preview_url text,
  featured boolean not null default false,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.certificates enable row level security;

drop policy if exists "Public read access to certificates" on public.certificates;
create policy "Public read access to certificates"
  on public.certificates
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Admin write access to certificates" on public.certificates;
create policy "Admin write access to certificates"
  on public.certificates
  for all
  to authenticated
  using (public.is_portfolio_admin())
  with check (public.is_portfolio_admin());

-- 6. Contact Messages (Written by Edge Function service role; Admin-only read/delete)
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

drop policy if exists "Admin read and delete access to contact_messages" on public.contact_messages;
create policy "Admin read and delete access to contact_messages"
  on public.contact_messages
  for select
  to authenticated
  using (public.is_portfolio_admin());

drop policy if exists "Admin delete access to contact_messages" on public.contact_messages;
create policy "Admin delete access to contact_messages"
  on public.contact_messages
  for delete
  to authenticated
  using (public.is_portfolio_admin());

-- 7. Supabase Storage Bucket & Policies
insert into storage.buckets (id, name, public)
values ('portfolio-media', 'portfolio-media', true)
on conflict (id) do nothing;

drop policy if exists "Public read access for portfolio-media" on storage.objects;
create policy "Public read access for portfolio-media"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'portfolio-media');

drop policy if exists "Admin upload access for portfolio-media" on storage.objects;
create policy "Admin upload access for portfolio-media"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'portfolio-media' and public.is_portfolio_admin());

drop policy if exists "Admin update access for portfolio-media" on storage.objects;
create policy "Admin update access for portfolio-media"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'portfolio-media' and public.is_portfolio_admin())
  with check (bucket_id = 'portfolio-media' and public.is_portfolio_admin());

drop policy if exists "Admin delete access for portfolio-media" on storage.objects;
create policy "Admin delete access for portfolio-media"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'portfolio-media' and public.is_portfolio_admin());

-- 8. Explicit Schema & Table Grants (RLS policies strictly enforce row access)
grant usage on schema public to anon, authenticated;

grant select on public.site_settings to anon, authenticated;
grant select on public.skill_categories to anon, authenticated;
grant select on public.projects to anon, authenticated;
grant select on public.certificates to anon, authenticated;

grant insert, update, delete on public.site_settings to authenticated;
grant insert, update, delete on public.skill_categories to authenticated;
grant insert, update, delete on public.projects to authenticated;
grant insert, update, delete on public.certificates to authenticated;
grant select on public.admin_users to authenticated;
grant select, delete on public.contact_messages to authenticated;

-- 9. Seed Authorized Admin Email
insert into public.admin_users (email)
values ('Amrithkaruppasamy1@gmail.com')
on conflict (email) do nothing;
