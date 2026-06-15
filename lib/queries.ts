import { createClient } from "@/lib/supabase/server"
import type { Project, BlogPost } from "@/lib/types"

const projectCache = new Map<string, Promise<{ data: Project | null }>>()
const blogCache = new Map<string, Promise<{ data: BlogPost | null }>>()

export function getProjectBySlug(slug: string) {
  if (!projectCache.has(slug)) {
    projectCache.set(slug, (async () => {
      const supabase = await createClient()
      return supabase.from("projects").select("*").eq("slug", slug).single()
    })())
  }
  return projectCache.get(slug)!
}

export function getBlogPostBySlug(slug: string) {
  if (!blogCache.has(slug)) {
    blogCache.set(slug, (async () => {
      const supabase = await createClient()
      return supabase.from("blog_posts").select("*").eq("slug", slug).single()
    })())
  }
  return blogCache.get(slug)!
}
