import { ArrowRight, Code, Palette, Smartphone, Server } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { ProjectCard } from "@/components/project-card"
import { TestimonialCard } from "@/components/testimonial-card"
import { SectionHeading } from "@/components/section-heading"
import { ContactForm } from "@/components/contact-form"
import { ScrollReveal } from "@/components/scroll-reveal"
import { HeroSection } from "@/components/hero-section"
import { TransitionLink } from "@/components/transition-link"
import { SOCIAL, SERVICES } from "@/lib/constants"

const iconMap: Record<string, React.ReactNode> = {
  Globe: <Code className="h-8 w-8" />,
  Palette: <Palette className="h-8 w-8" />,
  Smartphone: <Smartphone className="h-8 w-8" />,
  Server: <Server className="h-8 w-8" />,
}

export default async function HomePage() {
  const supabase = await createClient()

  const [featuredResult, testimonialsResult] = await Promise.all([
    supabase
      .from("projects")
      .select("id, title, slug, description, image_url, category, tech_stack, is_featured, live_url, repo_url, created_at, content")
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("testimonials")
      .select("id, name, role, avatar_url, message, rating, created_at")
      .order("created_at", { ascending: false }),
  ])
  const featuredProjects = featuredResult.data
  const testimonials = testimonialsResult.data

  return (
    <>
      <HeroSection />

      {/* Featured Projects */}
      {featuredProjects && featuredProjects.length > 0 && (
        <section className="section-padding">
          <div className="container-page">
            <SectionHeading
              title="Proyek Unggulan"
              subtitle="Beberapa proyek terbaik yang telah saya kerjakan."
            />
            <div className="grid gap-6 md:grid-cols-2">
              {featuredProjects.map((project, i) => (
                <ScrollReveal key={project.id} delay={i * 0.1}>
                  <ProjectCard project={project} featured />
                </ScrollReveal>
              ))}
            </div>
            <div className="text-center mt-10">
              <TransitionLink
                href="/projects"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Lihat Semua Proyek <ArrowRight className="h-4 w-4" />
              </TransitionLink>
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      <section className="section-padding bg-muted/30">
        <div className="container-page">
          <SectionHeading title="Layanan" subtitle="Layanan yang saya tawarkan untuk membantu mewujudkan ide Anda." />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((service, i) => (
              <ScrollReveal key={service.title} delay={i * 0.1}>
                <div
                  className="group rounded-2xl border bg-card p-6 text-center transition-all duration-300 hover:shadow-[0_0_30px_-5px] hover:shadow-primary/10 hover:-translate-y-1.5 hover:border-primary/30"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    {iconMap[service.icon]}
                  </div>
                  <h3 className="font-semibold mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials && testimonials.length > 0 && (
        <section className="section-padding">
          <div className="container-page">
            <SectionHeading
              title="Testimonial"
              subtitle="Apa kata klien tentang hasil kerja saya."
            />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t, i) => (
                <ScrollReveal key={t.id} delay={i * 0.1}>
                  <TestimonialCard testimonial={t} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      <section className="section-padding bg-muted/30">
        <div className="container-page max-w-2xl">
          <SectionHeading
            title="Hubungi Saya"
            subtitle="Punya proyek atau ide? Jangan ragu untuk menghubungi saya."
          />
          <ScrollReveal>
            <ContactForm />
            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p>atau kirim email ke{" "}
                <a href={`mailto:${SOCIAL.email}`} className="text-primary hover:text-primary/80 transition-colors font-medium">
                  {SOCIAL.email}
                </a>
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
