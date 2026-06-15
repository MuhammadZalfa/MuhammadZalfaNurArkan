"use client"

import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

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

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {currentPage > 1 && (
        <Link
          href={buildUrl(currentPage - 1)}
          className="p-2 rounded-lg border hover:bg-muted transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      )}
      {Array.from({ length: totalPages }).map((_, i) => {
        const page = i + 1
        return (
          <Link
            key={page}
            href={buildUrl(page)}
            className={cn(
              "px-4 py-2 rounded-lg border text-sm font-medium transition-colors",
              page === currentPage
                ? "bg-primary text-primary-foreground border-primary"
                : "hover:bg-muted",
            )}
          >
            {page}
          </Link>
        )
      })}
      {currentPage < totalPages && (
        <Link
          href={buildUrl(currentPage + 1)}
          className="p-2 rounded-lg border hover:bg-muted transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}
