"use client"

import { useEffect, useRef } from "react"
import { gsap } from "@/lib/gsap"
import type { Skill } from "@/lib/types"

interface SkillBarProps {
  skill: Skill
  delay?: number
}

export function SkillBar({ skill, delay = 0 }: SkillBarProps) {
  const barRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = barRef.current
    const root = rootRef.current
    if (!bar || !root) return

    const ctx = gsap.context(() => {
      gsap.set(bar, { width: "0%" })

      gsap.to(bar, {
        width: `${skill.level}%`,
        duration: 1.2,
        ease: "power3.out",
        delay,
        scrollTrigger: {
          trigger: root,
          start: "top 85%",
          once: true,
        },
      })
    })

    return () => ctx.revert()
  }, [skill.level, delay])

  return (
    <div ref={rootRef} className="group">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">{skill.name}</span>
        <span className="text-sm text-muted-foreground">{skill.level}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-muted overflow-hidden">
        <div
          ref={barRef}
          className="h-full rounded-full bg-primary"
        />
      </div>
    </div>
  )
}
