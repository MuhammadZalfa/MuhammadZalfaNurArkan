import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { deleteBlogPost } from "@/lib/admin"
import { formatDate } from "@/lib/utils"

export default async function AdminBlogPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Blog</h1>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> Tambah Artikel
        </Link>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium">Judul</th>
              <th className="text-left p-4 font-medium hidden md:table-cell">Tags</th>
              <th className="text-left p-4 font-medium hidden md:table-cell">Status</th>
              <th className="text-left p-4 font-medium hidden lg:table-cell">Tanggal</th>
              <th className="text-right p-4 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {posts?.map((post) => (
              <tr key={post.id} className="hover:bg-muted/30">
                <td className="p-4">
                  <p className="font-medium">{post.title}</p>
                  {post.excerpt && (
                    <p className="text-xs text-muted-foreground truncate max-w-[250px]">
                      {post.excerpt}
                    </p>
                  )}
                </td>
                <td className="p-4 hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {post.tags?.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="px-2 py-0.5 rounded-md text-xs bg-muted">
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4 hidden md:table-cell">
                  {post.published_at ? (
                    <span className="text-xs text-secondary font-medium">Published</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Draft</span>
                  )}
                </td>
                <td className="p-4 hidden lg:table-cell text-muted-foreground">
                  {post.published_at ? formatDate(post.published_at) : "-"}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/blog/${post.id}/edit`} className="p-2 hover:text-primary">
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <form action={async () => {
                      "use server"
                      await deleteBlogPost(post.id)
                    }}>
                      <button type="submit" className="p-2 hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!posts || posts.length === 0) && (
          <p className="p-8 text-center text-sm text-muted-foreground">
            Belum ada artikel.{" "}
            <Link href="/admin/blog/new" className="text-primary hover:underline">
              Tulis artikel pertama
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
