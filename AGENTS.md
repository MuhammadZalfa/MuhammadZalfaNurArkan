# AGENTS.md

## Stack

- Next.js 15 (App Router), TypeScript (strict), Tailwind CSS v3 + `tailwindcss-animate`, PostCSS
- Supabase Auth (SSR, cookie-based), next-themes (dark mode, `class` strategy), lucide-react, react-hot-toast
- shadcn/ui New York — components in `components/ui/`, config in `components.json`
- Path alias `@/*` maps to project root (not `src/`)

## Commands

| Command | What |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Lint (`eslint .` — flat config, next/core-web-vitals + next/typescript) |

No test framework configured. Lint is the only verification step.

## Project layout

```
app/                    — App Router pages
app/auth/               — Login, sign-up, forgot-password, update-password, confirm, error
app/admin/login/        — Admin login (separate from public auth)
app/admin/(dashboard)/  — Route group: admin sidebar layout + CRUD pages (dashboard, projects, blog, resume)
app/api/contact/        — POST /api/contact (inserts into `contacts` table)
app/projects/           — Public project listing + [slug]
app/blog/               — Public blog listing + [slug]
app/about/              — About page
app/contact/            — Contact page
components/             — Shared components (navbar, footer, project-card, blog-card, etc.)
components/ui/          — shadcn/ui components (button, card, badge, input, checkbox, label, dropdown-menu)
lib/supabase/           — Three clients: client.ts (browser), server.ts (server), middleware.ts
lib/utils.ts            — cn() helper (clsx + tailwind-merge), formatDate() (id-ID locale)
lib/constants.ts        — SITE metadata, SOCIAL links, NAV_LINKS, SERVICES
lib/types.ts            — Project, BlogPost, Experience, Education, Testimonial, Contact, Skill
lib/admin.ts            — Server Actions for admin CRUD (projects, blog, experience, education, image upload)
proxy.ts                — Middleware entrypoint (misnamed — should be middleware.ts), imports lib/supabase/middleware.ts
```

## Supabase Auth

- **Env vars**: `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (not `ANON_KEY`; anon key values still work with this var name)
- Copy `.env.example` → `.env.local`
- Server client (`lib/supabase/server.ts`) must be created fresh per function (async, calls `await cookies()`)
- Middleware client: entry point is `proxy.ts` at root, calls `updateSession` from `lib/supabase/middleware.ts`
- Admin auth guards via `is_admin` RPC call in `lib/admin.ts:checkAdmin()`
- Admin dashboard layout (`app/admin/(dashboard)/layout.tsx`) redirects to `/admin/login` if unauthenticated

## Style conventions

- `app/globals.css` defines CSS variables for theming (light + `.dark`)
- Font: **Inter** via `next/font/google` (variable `--font-inter`)
- Tailwind class-based dark mode (`dark:` prefix)
- Utility classes: `container-page` (max-w-6xl), `section-padding` (py-20 md:py-28)
- Custom animations in `tailwind.config.ts`: fade-in, fade-in-up, fade-in-down, slide-up, scale-in, float
- Use `cn()` from `@/lib/utils` for conditional className merging
- Users: `revalidatePath()` in Server Actions after CRUD mutations
- Notification: `react-hot-toast` (Toaster in root layout, bottom-right)

## shadcn/ui

- Add new components with `npx shadcn@latest add <component>`
- Existing UI components in `components/ui/`
- Radix primitives: checkbox, dropdown-menu, label, slot already in deps

## Supabase tables

`projects`, `blog_posts`, `experiences`, `educations`, `testimonials`, `contacts` — all accessed directly by name in queries. Image uploads go to `project-images` storage bucket.

## Languages

UI text is **Indonesian**. `formatDate()` uses `id-ID` locale in `lib/utils.ts`. Keep new UI strings in Indonesian.
