"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { TransitionLink } from "@/components/transition-link"

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
  searchParams?: Record<string, string>
}

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchParams = {},
}: PaginationProps) {
  if (totalPages <= 1) return null

  function buildUrl(page: number) {
    const params = new URLSearchParams(searchParams)
    params.set("page", String(page))
    return `${basePath}?${params.toString()}`
  }

  const pages: (number | "ellipsis")[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== "ellipsis") {
      pages.push("ellipsis")
    }
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      {currentPage > 1 && (
        <TransitionLink
          href={buildUrl(currentPage - 1)}
          className="p-2.5 rounded-xl border hover:bg-muted transition-all duration-200 hover:border-primary/30"
        >
          <ChevronLeft className="h-4 w-4" />
        </TransitionLink>
      )}
      {pages.map((page, i) =>
        page === "ellipsis" ? (
          <span key={`e${i}`} className="px-2 text-muted-foreground">
            &hellip;
          </span>
        ) : (
          <TransitionLink
            key={page}
            href={buildUrl(page)}
            className={cn(
              "min-w-[40px] h-10 flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200",
              page === currentPage
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "border hover:bg-muted hover:border-primary/30",
            )}
          >
            {page}
          </TransitionLink>
        ),
      )}
      {currentPage < totalPages && (
        <TransitionLink
          href={buildUrl(currentPage + 1)}
          className="p-2.5 rounded-xl border hover:bg-muted transition-all duration-200 hover:border-primary/30"
        >
          <ChevronRight className="h-4 w-4" />
        </TransitionLink>
      )}
    </div>
  )
}
