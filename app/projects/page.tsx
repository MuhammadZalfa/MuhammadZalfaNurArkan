import { createClient } from "@/lib/supabase/server"
import { CategoryFilter } from "@/components/category-filter"
import { SectionHeading } from "@/components/section-heading"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Portofolio",
  description: "Kumpulan proyek yang telah saya kerjakan.",
}

export default async function ProjectsPage() {
  const supabase = await createClient()

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })

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
        <CategoryFilter projects={projects ?? []} categories={uniqueCategories} />
      </div>
    </div>
  )
}
