"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import type { ComponentProps } from "react"
import { useTransition } from "@/lib/transition-context"

type TransitionLinkProps = ComponentProps<typeof Link>

export function TransitionLink({ href, children, onClick, ...props }: TransitionLinkProps) {
  const router = useRouter()
  const { animateExit } = useTransition()

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (onClick) onClick(e)
    if (e.defaultPrevented) return

    const target = (e.target as HTMLElement).closest("a")
    if (target?.getAttribute("target") === "_blank") return

    e.preventDefault()
    animateExit(() => router.push(href.toString()))
  }

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}
