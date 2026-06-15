import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Plus, Pencil, Trash2, FileText } from "lucide-react"
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
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Blog
        </h1>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/25"
        >
          <Plus className="h-4 w-4" /> Tambah Artikel
        </Link>
      </div>

      <div className="rounded-2xl border bg-card overflow-hidden">
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
              <tr key={post.id} className="hover:bg-muted/30 transition-colors">
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
                      <span key={tag} className="px-2.5 py-1 rounded-lg text-xs bg-muted text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4 hidden md:table-cell">
                  {post.published_at ? (
                    <span className="px-2.5 py-1 rounded-lg text-xs bg-secondary/10 text-secondary font-medium">Published</span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-lg text-xs bg-muted text-muted-foreground">Draft</span>
                  )}
                </td>
                <td className="p-4 hidden lg:table-cell text-muted-foreground">
                  {post.published_at ? formatDate(post.published_at) : "-"}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/blog/${post.id}/edit`} className="p-2 rounded-lg hover:bg-muted transition-colors" title="Edit">
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <form action={async () => {
                      "use server"
                      await deleteBlogPost(post.id)
                    }}>
                      <button type="submit" className="p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors" title="Hapus">
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
          <div className="py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              Belum ada artikel.{" "}
              <Link href="/admin/blog/new" className="text-primary hover:underline font-medium">
                Tulis artikel pertama
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
