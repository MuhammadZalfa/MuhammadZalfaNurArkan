import { createClient } from "@/lib/supabase/server"
import { SectionHeading } from "@/components/section-heading"
import { SkillBar } from "@/components/skill-bar"
import { Download } from "lucide-react"
import type { Metadata } from "next"
import type { Skill } from "@/lib/types"

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

  return (
    <div className="pt-24 md:pt-28 pb-20 md:pb-28">
      <div className="container-page max-w-4xl">
        <SectionHeading
          title="Tentang Saya"
          subtitle="Kenali saya lebih dekat."
        />

        <div className="flex flex-col md:flex-row gap-10 items-start mb-20 animate-fade-in-up">
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

        {Object.entries(groupedSkills).map(([category, categorySkills], i) => (
          <div key={category} className="mb-12 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
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
        ))}
      </div>
    </div>
  )
}
