import type { Skill } from "@/lib/types"

interface SkillBarProps {
  skill: Skill
}

export function SkillBar({ skill }: SkillBarProps) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium">{skill.name}</span>
        <span className="text-sm text-muted-foreground">{skill.level}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-700"
          style={{ width: `${skill.level}%` }}
        />
      </div>
    </div>
  )
}
