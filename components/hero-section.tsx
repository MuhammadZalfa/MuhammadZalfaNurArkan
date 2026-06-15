"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { gsap } from "@/lib/gsap"
import { TransitionLink } from "@/components/transition-link"

export function HeroSection() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

      tl.from(".hero-greeting",  { y: 30, opacity: 0, duration: 0.6 })
        .from(".hero-name",      { scale: 0.8, opacity: 0, duration: 0.8, ease: "back.out(1.7)" }, "-=0.2")
        .from(".hero-desc",      { y: 20, opacity: 0, duration: 0.6 }, "-=0.3")
        .fromTo(".hero-cta",     { y: 15, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.15, duration: 0.5, clearProps: "opacity,transform" }, "-=0.3")
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      className="relative min-h-screen flex items-center overflow-hidden pt-16 md:pt-20"
    >
      <div className="absolute inset-0 md:inset-y-0 md:left-[45%] z-[1]">
        <Image
          src="/Arkan.png"
          alt="Profile"
          fill
          priority
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 55vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent md:via-background/30" />
      </div>

      <div className="container-page relative z-10 py-20">
        <div className="max-w-xl">
          <span className="hero-greeting text-primary font-semibold text-sm tracking-widest uppercase">
            Hello, Saya
          </span>
          <h1 className="hero-name text-5xl md:text-7xl font-bold mt-4 tracking-tight">
            ZALFA
          </h1>
          <p className="hero-desc text-lg md:text-xl text-muted-foreground mt-4 leading-relaxed max-w-lg">
            Full-stack Developer & UI/UX Designer. Saya membangun aplikasi web
            modern yang cepat, responsif, dan user-friendly.
          </p>
          <div className="flex flex-wrap gap-4 mt-10">
            <TransitionLink
              href="/contact"
              className="hero-cta inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-[background,box-shadow] duration-200 shadow-lg shadow-primary/25 hover:shadow-primary/40"
            >
              Hubungi Saya <ArrowRight className="h-4 w-4" />
            </TransitionLink>
            <TransitionLink
              href="/projects"
              className="hero-cta inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-medium hover:bg-muted/50 transition-[background] duration-200"
            >
              Lihat Proyek
            </TransitionLink>
          </div>
        </div>
      </div>
    </section>
  )
}
