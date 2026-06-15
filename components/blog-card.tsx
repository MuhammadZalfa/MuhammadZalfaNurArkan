import Image from "next/image"
import { Calendar } from "lucide-react"
import type { BlogPost } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { TransitionLink } from "@/components/transition-link"

interface BlogCardProps {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <TransitionLink href={`/blog/${post.slug}`}>
      <div className="group relative rounded-2xl border bg-card overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_-5px] hover:shadow-primary/10 hover:border-primary/30 hover:-translate-y-1.5">
        <div className="aspect-video bg-muted overflow-hidden relative">
          <Image
            src={post.image_url || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&q=80"}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-all duration-700 group-hover:scale-110"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <Calendar className="h-3.5 w-3.5" />
            {post.published_at ? formatDate(post.published_at) : "Draft"}
          </div>
          <h3 className="font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {post.excerpt}
            </p>
          )}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-xs rounded-lg bg-muted text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </TransitionLink>
  )
}
