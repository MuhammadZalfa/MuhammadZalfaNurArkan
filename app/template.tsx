"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { usePathname } from "next/navigation"
import { gsap } from "@/lib/gsap"

export default function Template({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")

  useEffect(() => {
    if (isAdmin) return

    const el = root.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { opacity: 0, y: 20, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out", clearProps: "opacity,transform" },
      )
    })

    return () => ctx.revert()
  }, [isAdmin])

  return <div ref={root}>{children}</div>
}
