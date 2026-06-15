import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, User } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { formatDate } from "@/lib/utils"
import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from("blog_posts")
    .select("title, excerpt")
    .eq("slug", slug)
    .single()

  if (!data) return { title: "Artikel Tidak Ditemukan" }

  return {
    title: data.title,
    description: data.excerpt || data.title,
  }
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!post) notFound()

  return (
    <div className="pt-24 md:pt-28 pb-20 md:pb-28">
      <div className="container-page max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Kembali ke Blog
        </Link>

        <article>
          {post.image_url && (
            <div className="rounded-2xl overflow-hidden bg-muted mb-8 animate-fade-in-up">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full aspect-video object-cover"
              />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4 animate-fade-in-up">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {post.published_at ? formatDate(post.published_at) : "Draft"}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              Admin
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in-up">
            {post.title}
          </h1>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-muted text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {post.excerpt && (
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed border-l-4 border-primary/30 pl-4 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
              {post.excerpt}
            </p>
          )}

          <div
            className="prose prose-neutral dark:prose-invert max-w-none leading-relaxed animate-fade-in-up"
            style={{ animationDelay: "200ms" }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </div>
    </div>
  )
}
