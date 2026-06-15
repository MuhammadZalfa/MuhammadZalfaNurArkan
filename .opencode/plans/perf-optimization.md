# Performance Optimization Plan

## Phase 0: Setup
- [ ] Add `images.remotePatterns` to `next.config.ts` for Unsplash

## Phase 1: <img> → next/image (8 files)

### 1. `components/project-card.tsx`
- Remove `"use client"`, `useRouter`, `handleCardClick`, `handleKeyDown`
- Add `import Image from "next/image"`, `import Link from "next/link"`
- Wrap in `<Link href={/projects/${project.slug}}>` instead of role="link" div
- Replace `<img>` with `<Image fill sizes="..." className="object-cover" />`
- Remove closing `</div>` + `)` before component end → `</Link>`

### 2. `components/blog-card.tsx`
- Add `import Image from "next/image"`
- Replace `<img>` → `<Image fill sizes="..." className="object-cover" />`

### 3. `components/testimonial-card.tsx`
- Add `import Image from "next/image"`
- Replace `<img>` → `<Image width={40} height={40} className="rounded-full object-cover" />`

### 4. `components/hero-section.tsx`
- Add `import Image from "next/image"`
- Replace `backgroundImage` div → `<Image fill priority className="object-cover" />`
- Keep the gradient overlay div

### 5. `app/projects/[slug]/page.tsx`
- Add `import Image from "next/image"`
- Replace `<img>` → `<Image fill sizes="100vw" className="object-cover" priority />`

### 6. `app/blog/[slug]/page.tsx`
- Add `import Image from "next/image"`
- Replace `<img>` → `<Image fill sizes="100vw" className="object-cover" />`

### 7. `app/about/page.tsx`
- Add `import Image from "next/image"`
- Replace `<img>` → `<Image width={224} height={224} className="object-cover" />`

## Phase 2: Optimasi Data Fetching (5 files)

### 8. `app/page.tsx` — Parallel + column-specific
```ts
const [featuredResult, testimonialsResult] = await Promise.all([
  supabase
    .from("projects")
    .select("id, title, slug, description, image_url, category, tech_stack, is_featured")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(4),
  supabase
    .from("testimonials")
    .select("id, name, role, avatar_url, message, rating")
    .order("created_at", { ascending: false }),
])
const featuredProjects = featuredResult.data
const testimonials = testimonialsResult.data
```

### 9. `app/about/page.tsx` — Parallel + column-specific
```ts
const [skillsRes, expsRes, edusRes] = await Promise.all([
  supabase.from("skills").select("*").order("category").order("level", { ascending: false }),
  supabase.from("experiences")
    .select("id, title, company, location, start_date, end_date, current, description, tech_stack")
    .order("start_date", { ascending: false }),
  supabase.from("educations")
    .select("id, institution, degree, field_of_study, start_year, end_year, current, description")
    .order("start_year", { ascending: false }),
])
const skills = skillsRes.data
const experiences = expsRes.data
const educations = edusRes.data
```

### 10. `app/projects/page.tsx` — Hapus N+1 categories
- Hapus query categories terpisah (lines 41-48)
- Extract categories dari `projects` data:
```ts
const uniqueCategories = [
  ...new Set(projects?.map((p) => p.category).filter(Boolean) ?? []),
]
```

### 11. `app/projects/[slug]/page.tsx` — Merge metadata + page query
Buat `lib/queries.ts`:
```ts
import { createClient } from "@/lib/supabase/server"
import type { Project, BlogPost } from "@/lib/types"

const projectCache = new Map<string, Promise<{ data: Project | null }>>()
const blogCache = new Map<string, Promise<{ data: BlogPost | null }>>()

export async function getProjectBySlug(slug: string) {
  if (!projectCache.has(slug)) {
    projectCache.set(slug, (async () => {
      const supabase = await createClient()
      return supabase.from("projects").select("*").eq("slug", slug).single()
    })())
  }
  return projectCache.get(slug)!
}

export async function getBlogPostBySlug(slug: string) {
  if (!blogCache.has(slug)) {
    blogCache.set(slug, (async () => {
      const supabase = await createClient()
      return supabase.from("blog_posts").select("*").eq("slug", slug).single()
    })())
  }
  return blogCache.get(slug)!
}
```

Then di `projects/[slug]/page.tsx`:
- `generateMetadata` dan page component sama-sama panggil `getProjectBySlug(slug)`
- Karena cache promise, panggilan kedua reuse hasil yang sama
- `generateMetadata` tinggal `const { data } = await getProjectBySlug(slug)`

Sama untuk `blog/[slug]/page.tsx` dengan `getBlogPostBySlug`.

### 12. Column-specific SELECT di detail pages
- `projects/[slug]/page.tsx` di `lib/queries.ts`: `select("*")` — OK karena butuh semua field
- `blog/[slug]/page.tsx` di `lib/queries.ts`: `select("*")` — OK

## Phase 3: Middleware + Bundle (2 files)

### 13. `proxy.ts` — Persempit matcher
```ts
matcher: ["/admin/:path*", "/auth/:path*"]
```

### 14. `lib/transition-context.tsx` — Kurangi delay
```ts
duration: 0.3,  // was 0.5
```

## Execution Order
1. Phase 0 (config)
2. Phase 1 files (images) — build & verify after each
3. Phase 2 files (queries) — build & verify after each
4. Phase 3 files (middleware + transition) — build & verify
