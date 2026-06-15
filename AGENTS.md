# AGENTS.md

## Stack

- Next.js 15 (App Router), TypeScript (strict), Tailwind CSS v3 + `tailwindcss-animate`, PostCSS
- Supabase Auth (SSR, cookie-based), next-themes (dark mode, class strategy), lucide-react icons
- shadcn/ui New York style — components in `components/ui/`, config in `components.json`
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
app/          — Next.js App Router pages and layouts
app/auth/     — Login, sign-up, forgot-password, update-password, confirm, error
app/protected/— Authenticated-only page (redirects to /auth/login if unauthenticated)
components/   — Shared components (auth-button, hero, theme-switcher, forms, tutorial, ui/)
lib/supabase/ — Three clients: client.ts (browser), server.ts (server), proxy.ts (middleware)
lib/utils.ts  — cn() helper (clsx + tailwind-merge), hasEnvVars helper
proxy.ts      — Middleware (non-standard name — should be middleware.ts)
```

## Supabase Auth quirks

- **Env vars**: `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (not `ANON_KEY`)
- Copy `.env.example` → `.env.local` and fill in values from Supabase dashboard
- `hasEnvVars` check in `lib/utils.ts` gates auth UI — without env vars, page shows setup steps
- Server client (`lib/supabase/server.ts`) must be created fresh per function (Fluid compute warning in comments)
- Middleware client (`lib/supabase/proxy.ts`) also must be created per request
- `proxy.ts` at root is misnamed — if adding middleware functionality, use `middleware.ts`

## shadcn/ui

- Add new components with `npx shadcn@latest add <component>`
- Existing UI components in `components/ui/`
- Radix primitives: checkbox, dropdown-menu, label, slot already in deps

## Style conventions

- CSS variables for theming in `app/globals.css` (--background, --foreground, --primary, etc.)
- Tailwind class-based dark mode (`dark:` prefix)
- Geist font via next/font
- Use `cn()` from `@/lib/utils` for conditional className merging
