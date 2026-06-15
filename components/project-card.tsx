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
    <div
      className={cn(
        "group rounded-xl border bg-card overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1",
        featured && "md:col-span-2",
      )}
    >
      <div className="aspect-video bg-muted overflow-hidden">
        <img
          src={project.image_url || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80"}
          alt={project.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary mb-3">
          {project.category}
        </span>
        <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tech_stack?.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-xs rounded-md bg-muted text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="flex gap-3">
          <Link
            href={`/projects/${project.slug}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            Detail &rarr;
          </Link>
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          {project.repo_url && (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              <Github className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
