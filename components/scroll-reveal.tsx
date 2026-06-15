"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { gsap } from "@/lib/gsap"

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  direction?: "up" | "down" | "left" | "right" | "scale"
  delay?: number
  duration?: number
}

const fromMap = {
  up: { y: 30, opacity: 0 },
  down: { y: -20, opacity: 0 },
  left: { x: -30, opacity: 0 },
  right: { x: 30, opacity: 0 },
  scale: { scale: 0.9, opacity: 0 },
}

const toMap = {
  up: { y: 0, opacity: 1 },
  down: { y: 0, opacity: 1 },
  left: { x: 0, opacity: 1 },
  right: { x: 0, opacity: 1 },
  scale: { scale: 1, opacity: 1 },
}

export function ScrollReveal({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.6,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        fromMap[direction],
        {
          ...toMap[direction],
          duration,
          ease: "power3.out",
          delay,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        },
      )
    })

    return () => ctx.revert()
  }, [direction, delay, duration])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
