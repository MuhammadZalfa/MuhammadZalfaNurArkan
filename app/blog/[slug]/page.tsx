import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, User } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { formatDate } from "@/lib/utils"
import { ScrollReveal } from "@/components/scroll-reveal"
import { TransitionLink } from "@/components/transition-link"
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
        <TransitionLink
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Kembali ke Blog
        </TransitionLink>

        <article>
          {post.image_url && (
            <ScrollReveal>
              <div className="rounded-2xl overflow-hidden bg-muted mb-8">
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full aspect-video object-cover"
                />
              </div>
            </ScrollReveal>
          )}

          <ScrollReveal>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {post.published_at ? formatDate(post.published_at) : "Draft"}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                Admin
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {post.title}
            </h1>
          </ScrollReveal>

          {post.tags && post.tags.length > 0 && (
            <ScrollReveal delay={0.1}>
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-muted text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </ScrollReveal>
          )}

          {post.excerpt && (
            <ScrollReveal delay={0.15}>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed border-l-4 border-primary/30 pl-4">
                {post.excerpt}
              </p>
            </ScrollReveal>
          )}

          <ScrollReveal delay={0.2}>
            <div
              className="prose prose-neutral dark:prose-invert max-w-none leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </ScrollReveal>
        </article>
      </div>
    </div>
  )
}
