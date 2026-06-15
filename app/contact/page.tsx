import { Mail, MapPin, Phone } from "lucide-react"
import { ContactForm } from "@/components/contact-form"
import { SectionHeading } from "@/components/section-heading"
import { SOCIAL } from "@/lib/constants"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kontak",
  description: "Hubungi saya untuk diskusi atau kolaborasi.",
}

export default function ContactPage() {
  return (
    <div className="section-padding">
      <div className="container-page max-w-4xl">
        <SectionHeading
          title="Kontak"
          subtitle="Jangan ragu untuk menghubungi saya."
        />

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <ContactForm />
          </div>

          <div className="space-y-6">
            <h3 className="font-semibold text-lg">Informasi Kontak</h3>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10 text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Email</p>
                <a
                  href={`mailto:${SOCIAL.email}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {SOCIAL.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10 text-primary">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Telepon</p>
                <p className="text-sm text-muted-foreground">
                  +62 {SOCIAL.whatsapp.slice(1, 4)}-{SOCIAL.whatsapp.slice(4, 8)}-{SOCIAL.whatsapp.slice(8)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10 text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Lokasi</p>
                <p className="text-sm text-muted-foreground">
                  Jakarta, Indonesia
                </p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
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
