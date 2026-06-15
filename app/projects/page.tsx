import { createClient } from "@/lib/supabase/server"
import { ProjectCard } from "@/components/project-card"
import { SectionHeading } from "@/components/section-heading"
import { Pagination } from "@/components/pagination"
import { TransitionLink } from "@/components/transition-link"
import { ScrollReveal } from "@/components/scroll-reveal"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Portofolio",
  description: "Kumpulan proyek yang telah saya kerjakan.",
}

const ITEMS_PER_PAGE = 9

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>
}) {
  const params = await searchParams
  const category = params.category
  const page = Number(params.page) || 1
  const from = (page - 1) * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE - 1

  const supabase = await createClient()

  let query = supabase.from("projects").select("*", { count: "exact" })

  if (category) {
    query = query.eq("category", category)
  }

  const { data: projects, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to)

  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 0

  const uniqueCategories = [
    ...new Set(projects?.map((p) => p.category).filter(Boolean) ?? []),
  ]

  return (
    <div className="pt-24 md:pt-28 pb-20 md:pb-28">
      <div className="container-page">
        <SectionHeading
          title="Portofolio"
          subtitle="Kumpulan proyek yang telah saya kerjakan."
        />

        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          <TransitionLink
            href="/projects"
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              !category
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            }`}
          >
            Semua
          </TransitionLink>
          {uniqueCategories.map((cat: string) => (
            <TransitionLink
              key={cat}
              href={`/projects?category=${encodeURIComponent(cat)}`}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                category === cat
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground"
              }`}
            >
              {cat}
            </TransitionLink>
          ))}
        </div>

        {projects && projects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <ScrollReveal key={project.id} delay={i * 0.075}>
                <ProjectCard project={project} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Belum ada proyek.</p>
          </div>
        )}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath="/projects"
          searchParams={category ? { category } : {}}
        />
      </div>
    </div>
  )
}
