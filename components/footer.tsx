import Link from "next/link"
import { Github, Linkedin, Mail, ArrowUp } from "lucide-react"
import { NAV_LINKS, SOCIAL } from "@/lib/constants"

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/50">
      <div className="container-page py-16">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="space-y-4">
            <Link href="/" className="text-xl font-bold text-primary tracking-tight">
              Zalfa
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Full-stack Developer & UI/UX Designer. Membangun solusi digital
              yang berdampak.
            </p>
            <div className="flex gap-3">
              <a
                href={SOCIAL.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href={SOCIAL.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${SOCIAL.email}`}
                className="p-2.5 rounded-xl bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm tracking-wider uppercase text-muted-foreground">
              Tautan Cepat
            </h3>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm tracking-wider uppercase text-muted-foreground">
              Kontak
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a
                  href={`mailto:${SOCIAL.email}`}
                  className="hover:text-foreground transition-colors"
                >
                  {SOCIAL.email}
                </a>
              </li>
              <li>Tasikmalaya, Indonesia</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t">
        <div className="container-page flex items-center justify-between py-6">
          <p className="text-sm text-muted-foreground">
            &copy; {year} Zalfa. All rights reserved.
          </p>
          <a
            href="#"
            className="p-2 rounded-xl bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  )
}
