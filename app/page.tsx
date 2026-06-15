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
      <section className="section-padding">
        <div className="container-page flex flex-col items-center text-center">
          <div className="mb-6 h-32 w-32 rounded-full overflow-hidden border-4 border-primary/20">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80"
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Hi, Saya{" "}
            <span className="gradient-text">ZALFA</span>
          </h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl">
            Full-stack Developer & UI/UX Designer. Saya membangun aplikasi web
            modern yang cepat, responsif, dan user-friendly.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Hubungi Saya <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-lg border px-6 py-3 text-sm font-medium hover:bg-muted transition-colors"
            >
              Lihat Proyek
            </Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="section-padding bg-muted/30">
        <div className="container-page">
          <SectionHeading title="Tentang Saya" subtitle="Sedikit cerita tentang perjalanan saya di dunia teknologi." />
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-muted-foreground leading-relaxed">
              Saya adalah seorang pengembang full-stack dengan pengalaman dalam
              membangun aplikasi web menggunakan teknologi modern seperti Next.js,
              React, TypeScript, dan Node.js. Saya juga memiliki keahlian dalam
              desain UI/UX untuk menciptakan pengalaman pengguna yang intuitif.
            </p>
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
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} featured />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
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
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="rounded-xl border bg-card p-6 text-center transition-all hover:shadow-md hover:-translate-y-1"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {iconMap[service.icon]}
                </div>
                <h3 className="font-semibold mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground">
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
              {testimonials.map((t) => (
                <TestimonialCard key={t.id} testimonial={t} />
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
          <ContactForm />
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>atau kirim email ke{" "}
              <a href={`mailto:${SOCIAL.email}`} className="text-primary hover:underline">
                {SOCIAL.email}
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
