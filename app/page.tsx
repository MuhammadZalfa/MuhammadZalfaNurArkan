import Link from "next/link"
import { ArrowRight, Code, Palette, Smartphone, Server } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { ProjectCard } from "@/components/project-card"
import { TestimonialCard } from "@/components/testimonial-card"
import { SectionHeading } from "@/components/section-heading"
import { ContactForm } from "@/components/contact-form"
import { SOCIAL, SERVICES } from "@/lib/constants"

const iconMap: Record<string, React.ReactNode> = {
  Globe: <Code className="h-8 w-8" />,
  Palette: <Palette className="h-8 w-8" />,
  Smartphone: <Smartphone className="h-8 w-8" />,
  Server: <Server className="h-8 w-8" />,
}

export default async function HomePage() {
  const supabase = await createClient()

  const { data: featuredProjects } = await supabase
    .from("projects")
    .select("*")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(4)

  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16 md:pt-20">
        <div className="absolute inset-0 md:inset-y-0 md:left-[45%]">
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: "url(/Arkan.png)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent md:via-background/30" />
        </div>
        <div className="container-page relative z-10 py-20">
          <div className="max-w-xl animate-fade-in-up">
            <span className="text-primary font-semibold text-sm tracking-widest uppercase">
              Hello, Saya
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mt-4 tracking-tight">
              ZALFA
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mt-4 leading-relaxed max-w-lg">
              Full-stack Developer & UI/UX Designer. Saya membangun aplikasi web
              modern yang cepat, responsif, dan user-friendly.
            </p>
            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/25 hover:shadow-primary/40"
              >
                Hubungi Saya <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-medium hover:bg-muted/50 transition-all duration-200"
              >
                Lihat Proyek
              </Link>
            </div>
          </div>
        </div>
      </section>

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
                <div key={project.id} style={{ animationDelay: `${i * 100}ms` }} className="animate-fade-in-up">
                  <ProjectCard project={project} featured />
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Lihat Semua Proyek <ArrowRight className="h-4 w-4" />
              </Link>
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
              <div
                key={service.title}
                style={{ animationDelay: `${i * 100}ms` }}
                className="group rounded-2xl border bg-card p-6 text-center transition-all duration-300 hover:shadow-[0_0_30px_-5px] hover:shadow-primary/10 hover:-translate-y-1.5 hover:border-primary/30 animate-fade-in-up"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  {iconMap[service.icon]}
                </div>
                <h3 className="font-semibold mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
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
                <div key={t.id} style={{ animationDelay: `${i * 100}ms` }} className="animate-fade-in-up">
                  <TestimonialCard testimonial={t} />
                </div>
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
          <div className="animate-fade-in-up">
            <ContactForm />
            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p>atau kirim email ke{" "}
                <a href={`mailto:${SOCIAL.email}`} className="text-primary hover:text-primary/80 transition-colors font-medium">
                  {SOCIAL.email}
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
