"use client"

import { MessageCircle } from "lucide-react"
import { SOCIAL, WHATSAPP_MESSAGE } from "@/lib/constants"

export function WhatsAppButton() {
  const url = `https://wa.me/${SOCIAL.whatsapp}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform hover:scale-110 hover:bg-green-600"
      aria-label="WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  )
}
