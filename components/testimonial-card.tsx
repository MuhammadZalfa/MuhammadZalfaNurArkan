import { Star } from "lucide-react"
import type { Testimonial } from "@/lib/types"

interface TestimonialCardProps {
  testimonial: Testimonial
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="rounded-xl border bg-card p-6 transition-all hover:shadow-md">
      <div className="flex gap-1 mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < testimonial.rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/30"}`}
        />
      ))}
      </div>
      <p className="text-sm text-muted-foreground mb-4 italic">
        &ldquo;{testimonial.message}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <img
          src={testimonial.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80"}
          alt={testimonial.name}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div>
          <p className="font-medium text-sm">{testimonial.name}</p>
          <p className="text-xs text-muted-foreground">{testimonial.role}</p>
        </div>
      </div>
    </div>
  )
}
