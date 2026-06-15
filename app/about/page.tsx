import { createClient } from "@/lib/supabase/server"
import { SectionHeading } from "@/components/section-heading"
import { SkillBar } from "@/components/skill-bar"
import { ScrollReveal } from "@/components/scroll-reveal"
import { Download, Calendar, MapPin, Building2, GraduationCap, Briefcase } from "lucide-react"
import type { Metadata } from "next"
import type { Skill, Experience, Education } from "@/lib/types"

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString("id-ID", { month: "long", year: "numeric" })
}

export const metadata: Metadata = {
  title: "Tentang Saya",
  description: "Pelajari lebih lanjut tentang pengalaman dan keahlian saya.",
}

export default async function AboutPage() {
  const supabase = await createClient()

  const { data: skills } = await supabase
    .from("skills")
    .select("*")
    .order("category")
    .order("level", { ascending: false })

  const groupedSkills: Record<string, Skill[]> = {}
  skills?.forEach((skill) => {
    if (!groupedSkills[skill.category]) {
      groupedSkills[skill.category] = []
    }
    groupedSkills[skill.category]!.push(skill)
  })

  const { data: experiences } = await supabase
    .from("experiences")
    .select("*")
    .order("start_date", { ascending: false })

  const { data: educations } = await supabase
    .from("educations")
    .select("*")
    .order("start_year", { ascending: false })

  return (
    <div className="pt-24 md:pt-28 pb-20 md:pb-28">
      <div className="container-page max-w-4xl">
        <SectionHeading
          title="Tentang Saya"
          subtitle="Kenali saya lebih dekat."
        />

        <ScrollReveal>
          <div className="flex flex-col md:flex-row gap-10 items-start mb-20">
            <div className="shrink-0">
              <div className="relative h-56 w-56 rounded-2xl overflow-hidden ring-2 ring-primary/20">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent z-10" />
                <img
                  src="/Arkan.png"
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="space-y-5">
              <p className="text-muted-foreground leading-relaxed">
                Saya adalah seorang full-stack developer yang bersemangat dalam
                membangun aplikasi web modern. Dengan pengalaman dalam berbagai
                teknologi, saya selalu berusaha memberikan solusi terbaik untuk
                setiap proyek yang saya kerjakan.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Saya percaya bahwa teknologi yang baik adalah yang mampu
                menyelesaikan masalah nyata. Oleh karena itu, saya selalu fokus
                pada pemahaman kebutuhan klien sebelum memulai pengembangan.
              </p>
              <a
                href="/cv.pdf"
                download
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/25"
              >
                <Download className="h-4 w-4" /> Download CV
              </a>
            </div>
          </div>
        </ScrollReveal>

        {Object.entries(groupedSkills).map(([category, categorySkills], i) => (
          <ScrollReveal key={category} delay={i * 0.1}>
            <div className="mb-12">
              <h3 className="text-xl font-bold mb-6 capitalize flex items-center gap-3">
                <span className="inline-block h-1 w-6 rounded-full bg-primary" />
                {category}
              </h3>
              <div className="grid gap-5 md:grid-cols-2">
                {categorySkills.map((skill) => (
                  <SkillBar key={skill.id} skill={skill} />
                ))}
              </div>
            </div>
          </ScrollReveal>
        ))}

        {/* Experiences */}
        <ScrollReveal>
          <section className="mb-16 mt-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <Briefcase className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold">Pengalaman</h2>
            </div>

            {experiences && experiences.length > 0 ? (
              <div className="space-y-5">
                {experiences.map((exp: Experience, i: number) => (
                  <ScrollReveal key={exp.id} delay={i * 0.1}>
                    <div className="group relative rounded-2xl border bg-card p-6 transition-all duration-300 hover:shadow-[0_0_25px_-5px] hover:shadow-primary/5 hover:border-primary/20">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
                        <div>
                          <h3 className="font-bold text-lg">{exp.title}</h3>
                          {exp.company && (
                            <p className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                              <Building2 className="h-3.5 w-3.5" />
                              {exp.company}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground shrink-0">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(exp.start_date)} — {exp.current ? "Sekarang" : exp.end_date ? formatDate(exp.end_date) : ""}
                          </span>
                          {exp.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {exp.location}
                            </span>
                          )}
                        </div>
                      </div>

                      {exp.current && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-secondary/10 text-secondary mb-3">
                          Sedang Berlangsung
                        </span>
                      )}

                      {exp.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {exp.description}
                        </p>
                      )}

                      {exp.tech_stack && exp.tech_stack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t">
                          {exp.tech_stack.map((tech: string) => (
                            <span
                              key={tech}
                              className="px-2.5 py-1 text-xs rounded-lg bg-muted text-muted-foreground"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-12 bg-muted/30 rounded-2xl">
                Belum ada pengalaman.
              </p>
            )}
          </section>
        </ScrollReveal>

        {/* Educations */}
        <ScrollReveal>
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <GraduationCap className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold">Pendidikan</h2>
            </div>

            {educations && educations.length > 0 ? (
              <div className="space-y-5">
                {educations.map((edu: Education, i: number) => (
                  <ScrollReveal key={edu.id} delay={i * 0.1}>
                    <div className="group relative rounded-2xl border bg-card p-6 transition-all duration-300 hover:shadow-[0_0_25px_-5px] hover:shadow-primary/5 hover:border-primary/20">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
                        <div>
                          <h3 className="font-bold text-lg">{edu.institution}</h3>
                          {edu.degree && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {edu.degree}
                              {edu.field_of_study && ` — ${edu.field_of_study}`}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                          <Calendar className="h-3.5 w-3.5" />
                          {edu.start_year} — {edu.current ? "Sekarang" : edu.end_year || ""}
                        </div>
                      </div>

                      {edu.current && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-secondary/10 text-secondary mb-3">
                          Sedang Berlangsung
                        </span>
                      )}

                      {edu.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed pt-2">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-12 bg-muted/30 rounded-2xl">
                Belum ada riwayat pendidikan.
              </p>
            )}
          </section>
        </ScrollReveal>
      </div>
    </div>
  )
}
