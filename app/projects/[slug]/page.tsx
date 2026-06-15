import { notFound } from "next/navigation"
import { ArrowLeft, ExternalLink, Github, Calendar } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { formatDate } from "@/lib/utils"
import { ScrollReveal } from "@/components/scroll-reveal"
import { TransitionLink } from "@/components/transition-link"
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
    <div className="pt-24 md:pt-28 pb-20 md:pb-28">
      <div className="container-page max-w-4xl">
        <TransitionLink
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Kembali ke Portofolio
        </TransitionLink>

        <ScrollReveal>
          <div className="rounded-2xl overflow-hidden bg-muted mb-10">
            <img
              src={project.image_url || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80"}
              alt={project.title}
              className="w-full aspect-video object-cover"
            />
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
            <Calendar className="h-4 w-4" />
            {formatDate(project.created_at)}
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              {project.category}
            </span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {project.title}
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tech_stack?.map((tech: string) => (
              <span
                key={tech}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-muted text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="flex gap-3 mb-10">
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/25"
              >
                <ExternalLink className="h-4 w-4" /> Live Demo
              </a>
            )}
            {project.repo_url && (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium hover:bg-muted/50 transition-all duration-200"
              >
                <Github className="h-4 w-4" /> Source Code
              </a>
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="space-y-4">
            <p className="text-muted-foreground leading-relaxed text-lg">
              {project.description}
            </p>
            <div
              className="leading-relaxed text-muted-foreground whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: project.content }}
            />
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
