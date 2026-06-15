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
    <div className="section-padding">
      <div className="container-page max-w-4xl">
        <SectionHeading
          title="Tentang Saya"
          subtitle="Kenali saya lebih dekat."
        />

        <div className="flex flex-col md:flex-row gap-8 items-start mb-16">
          <div className="shrink-0">
            <div className="h-48 w-48 rounded-xl overflow-hidden border-4 border-primary/20">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80"
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="space-y-4">
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
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Download className="h-4 w-4" /> Download CV
            </a>
          </div>
        </div>

        {/* Skills */}
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <div key={category} className="mb-10">
            <h3 className="text-xl font-semibold mb-6 capitalize">{category}</h3>
            <div className="grid gap-4 md:grid-cols-2">
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
