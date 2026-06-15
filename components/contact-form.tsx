"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import toast from "react-hot-toast"
import { Loader2, Send } from "lucide-react"

const schema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  message: z.string().min(10, "Pesan minimal 10 karakter"),
})

type FormData = z.infer<typeof schema>

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error("Gagal mengirim pesan")

      toast.success("Pesan berhasil dikirim!")
      reset()
    } catch {
      toast.error("Gagal mengirim pesan. Silakan coba lagi.")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1.5">
          Nama
        </label>
        <input
          id="name"
          {...register("name")}
          className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary placeholder:text-muted-foreground/50"
          placeholder="Nama Anda"
        />
        {errors.name && (
          <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
            <span className="inline-block h-1 w-1 rounded-full bg-destructive" />
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1.5">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary placeholder:text-muted-foreground/50"
          placeholder="email@anda.com"
        />
        {errors.email && (
          <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
            <span className="inline-block h-1 w-1 rounded-full bg-destructive" />
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1.5">
          Pesan
        </label>
        <textarea
          id="message"
          rows={5}
          {...register("message")}
          className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary placeholder:text-muted-foreground/50 resize-none"
          placeholder="Tulis pesan Anda..."
        />
        {errors.message && (
          <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
            <span className="inline-block h-1 w-1 rounded-full bg-destructive" />
            {errors.message.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 shadow-lg shadow-primary/25 hover:shadow-primary/40"
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        {isSubmitting ? "Mengirim..." : "Kirim Pesan"}
      </button>
    </form>
  )
}
