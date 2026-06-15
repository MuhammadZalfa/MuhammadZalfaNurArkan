import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { ProjectCard } from "@/components/project-card"
import { SectionHeading } from "@/components/section-heading"
import { Pagination } from "@/components/pagination"

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

  const { data: categories } = await supabase
    .from("projects")
    .select("category")
    .not("category", "is", null)

  const uniqueCategories = [
    ...new Set(categories?.map((c: { category: string }) => c.category).filter(Boolean)),
  ]

  return (
    <div className="section-padding">
      <div className="container-page">
        <SectionHeading
          title="Portofolio"
          subtitle="Kumpulan proyek yang telah saya kerjakan."
        />

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <Link
            href="/projects"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !category
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            Semua
          </Link>
          {uniqueCategories.map((cat: string) => (
            <Link
              key={cat}
              href={`/projects?category=${encodeURIComponent(cat)}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {projects && projects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-12">
            Belum ada proyek.
          </p>
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
