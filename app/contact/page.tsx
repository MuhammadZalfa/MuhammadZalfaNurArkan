import { Mail, MapPin, Phone } from "lucide-react"
import { ContactForm } from "@/components/contact-form"
import { SectionHeading } from "@/components/section-heading"
import { SOCIAL } from "@/lib/constants"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kontak",
  description: "Hubungi saya untuk diskusi atau kolaborasi.",
}

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: SOCIAL.email,
    href: `mailto:${SOCIAL.email}`,
  },
  {
    icon: Phone,
    label: "Telepon",
    value: `+62 85183152660`,
  },
  {
    icon: MapPin,
    label: "Lokasi",
    value: "Tasikmalaya, Indonesia",
  },
]

export default function ContactPage() {
  return (
    <div className="pt-24 md:pt-28 pb-20 md:pb-28">
      <div className="container-page max-w-5xl">
        <SectionHeading
          title="Kontak"
          subtitle="Jangan ragu untuk menghubungi saya."
        />

        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-3 animate-fade-in-up">
            <div className="rounded-2xl border bg-card p-6 md:p-8">
              <ContactForm />
            </div>
          </div>

          <div className="md:col-span-2 space-y-6 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
            <h3 className="font-bold text-lg">Informasi Kontak</h3>

            <div className="space-y-5">
              {contactInfo.map((info) => {
                const Icon = info.icon
                const Comp = info.href ? "a" : "div"
                const compProps = info.href ? { href: info.href } : {}

                return (
                  <Comp
                    key={info.label}
                    {...compProps}
                    className="flex items-start gap-4 group"
                  >
                    <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{info.label}</p>
                      <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                        {info.value}
                      </p>
                    </div>
                  </Comp>
                )
              })}
            </div>

            <div className="pt-6 border-t">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Atau hubungi saya melalui WhatsApp dengan klik tombol hijau di
                pojok kanan bawah.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
