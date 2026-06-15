"use client"

import Image from "next/image"
import Link from "next/link"
import { ExternalLink, Github } from "lucide-react"
import type { Project } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ProjectCardProps {
  project: Project
  featured?: boolean
}

export function ProjectCard({ project, featured }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        "group relative rounded-2xl border bg-card overflow-hidden transition-all duration-500 cursor-pointer",
        "hover:shadow-[0_0_30px_-5px] hover:shadow-primary/10 hover:border-primary/30 hover:-translate-y-1.5",
        featured && "md:col-span-2",
      )}
    >
      <div className="aspect-video bg-muted overflow-hidden relative">
        <Image
          src={project.image_url || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80"}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/0 to-background/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
            {project.category}
          </span>
        </div>
        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tech_stack?.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 text-xs rounded-lg bg-muted text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-4 pt-2 border-t">
          <span className="text-sm font-medium text-primary">
            Detail &rarr;
          </span>
          {project.live_url && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); window.open(project.live_url!, "_blank", "noopener,noreferrer") }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
            </button>
          )}
          {project.repo_url && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); window.open(project.repo_url!, "_blank", "noopener,noreferrer") }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </Link>
  )
}
