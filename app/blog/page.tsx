import { createClient } from "@/lib/supabase/server"
import { BlogCard } from "@/components/blog-card"
import { SectionHeading } from "@/components/section-heading"
import { Pagination } from "@/components/pagination"
import { ScrollReveal } from "@/components/scroll-reveal"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog",
  description: "Artikel dan tulisan terbaru.",
}

const ITEMS_PER_PAGE = 6

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const from = (page - 1) * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE - 1

  const supabase = await createClient()

  const { data: posts, count } = await supabase
    .from("blog_posts")
    .select("*", { count: "exact" })
    .not("published_at", "is", null)
    .order("published_at", { ascending: false })
    .range(from, to)

  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 0

  return (
    <div className="pt-24 md:pt-28 pb-20 md:pb-28">
      <div className="container-page">
        <SectionHeading
          title="Blog"
          subtitle="Artikel dan tutorial seputar pengembangan web dan teknologi."
        />

        {posts && posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <ScrollReveal key={post.id} delay={i * 0.075}>
                <BlogCard post={post} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Belum ada artikel.</p>
          </div>
        )}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath="/blog"
        />
      </div>
    </div>
  )
}
