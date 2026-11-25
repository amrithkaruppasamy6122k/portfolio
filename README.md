# Amrith — AI Engineer & Full-Stack Developer Portfolio

Cinematic personal portfolio built with React, Vite, TypeScript, Tailwind CSS, Framer Motion, GSAP ScrollTrigger, Lucide React, React Router, and Supabase.

## 1. Local Development

```bash
npm install
npm run dev
```

## 2. Supplied & Pending Assets (`public/`)

- `public/videos/intro.mp4` — Full-screen intro video (configured in `src/config/assets.config.ts`)
- `public/videos/about-me.mp4` — 16:9 About Me video
- `public/images/portfolio-background.jpg` — Primary cinematic background
- `public/images/projects/*.jpg` — Cover visuals for the 6 featured projects
- `public/documents/resume.pdf` — Add your actual resume PDF here (or upload via `/admin`)

## 3. Supabase Setup (Phase 4 — Auth, Database & Storage)

1. Create a Supabase project and copy `.env.example` to `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
2. Open the Supabase SQL Editor and run [`supabase/schema.sql`](./supabase/schema.sql).
3. In **Authentication -> Providers -> Email**, disable **Allow new users to sign up** so public registration is disabled.
4. Create your single administrator user in **Authentication -> Users**, then register them in `public.admin_users`:
   ```sql
   insert into public.admin_users (email) values ('Amrithkaruppasamy1@gmail.com');
   ```
5. Visit `/admin`, sign in, and click **Seed Default Content** to populate Supabase tables with your initial portfolio data.

## 4. Real Contact Email Delivery (Phase 5 — Supabase Edge Function)

Deploy [`supabase/functions/send-contact-email/index.ts`](./supabase/functions/send-contact-email/index.ts):

```bash
supabase functions deploy send-contact-email --no-verify-jwt
supabase secrets set RESEND_API_KEY=your_resend_api_key CONTACT_RECIPIENT_EMAIL=Amrithkaruppasamy1@gmail.com CONTACT_FROM_EMAIL="Portfolio <onboarding@resend.dev>"
```

*(Never expose `RESEND_API_KEY` or `SUPABASE_SERVICE_ROLE_KEY` in frontend `.env` variables.)*

## 5. Production Build & Vercel Deployment (Phase 6)

```bash
npm run lint
npm run build
```

[`vercel.json`](./vercel.json) is pre-configured with SPA route rewrites (`/admin`, `*`) and immutable cache headers for `/videos/*` and `/images/*`. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel Project Environment Variables before deploying.
