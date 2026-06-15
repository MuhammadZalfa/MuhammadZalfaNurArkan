import { Star, Quote } from "lucide-react"
import type { Testimonial } from "@/lib/types"

interface TestimonialCardProps {
  testimonial: Testimonial
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="relative rounded-2xl border bg-card p-6 transition-all duration-300 hover:shadow-[0_0_25px_-5px] hover:shadow-primary/5 hover:border-primary/20">
      <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/10" />
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < testimonial.rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/20"}`}
          />
        ))}
      </div>
      <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
        &ldquo;{testimonial.message}&rdquo;
      </p>
      <div className="flex items-center gap-3 pt-4 border-t">
        <img
          src={testimonial.avatar_url || "/Arkan.png"}
          alt={testimonial.name}
          className="h-10 w-10 rounded-full object-cover ring-2 ring-muted"
        />
        <div>
          <p className="font-medium text-sm">{testimonial.name}</p>
          <p className="text-xs text-muted-foreground">{testimonial.role}</p>
        </div>
      </div>
    </div>
  )
}
