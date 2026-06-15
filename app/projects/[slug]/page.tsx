import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ExternalLink, Github, Calendar } from "lucide-react"
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
    .from("projects")
    .select("title, description")
    .eq("slug", slug)
    .single()

  if (!data) return { title: "Proyek Tidak Ditemukan" }

  return {
    title: data.title,
    description: data.description,
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!project) notFound()

  return (
    <div className="section-padding">
      <div className="container-page max-w-4xl">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Portofolio
        </Link>

        <div className="aspect-video rounded-xl overflow-hidden bg-muted mb-8">
          <img
            src={project.image_url || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80"}
            alt={project.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
          <Calendar className="h-4 w-4" />
          {formatDate(project.created_at)}
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
            {project.category}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">{project.title}</h1>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tech_stack?.map((tech: string) => (
            <span
              key={tech}
              className="px-3 py-1 text-xs font-medium rounded-full border"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex gap-3 mb-8">
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <ExternalLink className="h-4 w-4" /> Live Demo
            </a>
          )}
          {project.repo_url && (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
            >
              <Github className="h-4 w-4" /> Source Code
            </a>
          )}
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-4">{project.description}</p>
          <div
            className="leading-relaxed whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: project.content }}
          />
        </div>
      </div>
    </div>
  )
}
