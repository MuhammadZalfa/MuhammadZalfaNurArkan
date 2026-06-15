import type { Skill } from "@/lib/types"

interface SkillBarProps {
  skill: Skill
}

export function SkillBar({ skill }: SkillBarProps) {
  return (
    <div className="group">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">{skill.name}</span>
        <span className="text-sm text-muted-foreground">{skill.level}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-1000 ease-out"
          style={{ width: `${skill.level}%` }}
        />
      </div>
    </div>
  )
}
