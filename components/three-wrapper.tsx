"use client"

import { usePathname } from "next/navigation"
import dynamic from "next/dynamic"

const ThreeBackground = dynamic(
  () => import("@/components/three-background").then((m) => m.ThreeBackground),
  { ssr: false },
)

export function ThreeWrapper() {
  const pathname = usePathname()
  if (pathname !== "/") return null

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none">
      <ThreeBackground />
    </div>
  )
}
