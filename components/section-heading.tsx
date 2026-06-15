import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  title: string
  subtitle?: string
  className?: string
  align?: "center" | "left"
}

export function SectionHeading({ title, subtitle, className, align = "center" }: SectionHeadingProps) {
  return (
    <div className={cn(
      align === "center" ? "text-center" : "text-left",
      "mb-14",
      className,
    )}>
      <span className="inline-block h-1 w-8 rounded-full bg-primary mb-5" />
      <h2 className="text-3xl font-bold md:text-4xl tracking-tight">{title}</h2>
      {subtitle && (
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}
