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
    <div className="section-padding">
      <div className="container-page max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Blog
        </Link>

        <article>
          {post.image_url && (
            <div className="aspect-video rounded-xl overflow-hidden bg-muted mb-8">
              <img
                src={post.image_url}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {post.published_at ? formatDate(post.published_at) : "Draft"}
            </span>
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              Admin
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-medium rounded-full border"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {post.excerpt && (
            <p className="text-lg text-muted-foreground mb-6 italic">
              {post.excerpt}
            </p>
          )}

          <div
            className="prose prose-neutral dark:prose-invert max-w-none leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </div>
    </div>
  )
}
