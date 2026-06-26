"use client"

import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ProjectCard } from "@/components/project-card"
import { ScrollReveal } from "@/components/scroll-reveal"
import { cn } from "@/lib/utils"
import type { Project } from "@/lib/types"

const ITEMS_PER_PAGE = 9

interface CategoryFilterProps {
  projects: Project[]
  categories: string[]
}

export function CategoryFilter({ projects, categories }: CategoryFilterProps) {
  const [category, setCategory] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    if (!category) return projects
    return projects.filter((p) => p.category === category)
  }, [category, projects])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)

  const paginatedProjects = useMemo(
    () => filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE),
    [filtered, page],
  )

  function handleCategoryChange(cat: string | null) {
    setCategory(cat)
    setPage(1)
  }

  function buildPages(): (number | "ellipsis")[] {
    const pages: (number | "ellipsis")[] = []
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - 1 && i <= page + 1)
      ) {
        pages.push(i)
      } else if (pages[pages.length - 1] !== "ellipsis") {
        pages.push("ellipsis")
      }
    }
    return pages
  }

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-10 justify-center">
        <button
          onClick={() => handleCategoryChange(null)}
          className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
            !category
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
              : "bg-muted hover:bg-muted/80 text-muted-foreground"
          }`}
        >
          Semua
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              category === cat
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {paginatedProjects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedProjects.map((project, i) => (
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

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          {page > 1 && (
            <button
              onClick={() => setPage(page - 1)}
              className="p-2.5 rounded-xl border hover:bg-muted transition-all duration-200 hover:border-primary/30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          {buildPages().map((item, i) =>
            item === "ellipsis" ? (
              <span key={`e${i}`} className="px-2 text-muted-foreground">
                &hellip;
              </span>
            ) : (
              <button
                key={item}
                onClick={() => setPage(item)}
                className={cn(
                  "min-w-[40px] h-10 flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200",
                  item === page
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "border hover:bg-muted hover:border-primary/30",
                )}
              >
                {item}
              </button>
            ),
          )}
          {page < totalPages && (
            <button
              onClick={() => setPage(page + 1)}
              className="p-2.5 rounded-xl border hover:bg-muted transition-all duration-200 hover:border-primary/30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </>
  )
}
