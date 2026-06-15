"use client"

import { createContext, useContext, useRef, useCallback, type ReactNode } from "react"
import { usePathname } from "next/navigation"
import { gsap } from "@/lib/gsap"

interface TransitionContextType {
  animateExit: (callback: () => void) => void
}

const TransitionContext = createContext<TransitionContextType | null>(null)

export function useTransition() {
  const ctx = useContext(TransitionContext)
  if (!ctx) {
    const noop = (_cb: () => void) => _cb()
    return { animateExit: noop }
  }
  return ctx
}

export function TransitionProvider({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")

  const animateExit = useCallback((callback: () => void) => {
    const el = containerRef.current
    if (!el || isAdmin) {
      callback()
      return
    }

    const ctx = gsap.context(() => {
      gsap.to(el, {
        opacity: 0,
        y: -20,
        scale: 0.98,
        duration: 0.5,
        ease: "power3.in",
        onComplete: callback,
      })
    })

    return () => ctx.revert()
  }, [isAdmin])

  return (
    <TransitionContext.Provider value={{ animateExit }}>
      <div ref={containerRef}>{children}</div>
    </TransitionContext.Provider>
  )
}
