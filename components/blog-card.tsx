import Link from "next/link"
import { Calendar } from "lucide-react"
import type { BlogPost } from "@/lib/types"
import { formatDate } from "@/lib/utils"

interface BlogCardProps {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <div className="group rounded-xl border bg-card overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
        <div className="aspect-video bg-muted overflow-hidden">
          <img
            src={post.image_url || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&q=80"}
            alt={post.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Calendar className="h-3.5 w-3.5" />
            {post.published_at ? formatDate(post.published_at) : "Draft"}
          </div>
          <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {post.excerpt}
            </p>
          )}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs rounded-md bg-muted text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
