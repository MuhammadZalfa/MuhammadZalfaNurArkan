"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createBlogPost, updateBlogPost } from "@/lib/admin"
import { Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import type { BlogPost } from "@/lib/types"

interface BlogFormProps {
  post?: BlogPost
}

export function BlogForm({ post }: BlogFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  function slugify(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = e.currentTarget
    const formData = new FormData(form)

    const tagsInput = (formData.get("tags") as string) || ""
    formData.set("tags", JSON.stringify(tagsInput.split(",").map((t: string) => t.trim()).filter(Boolean)))

    let result: { error?: string }
    if (post) {
      result = await updateBlogPost(post.id, formData)
    } else {
      result = await createBlogPost(formData)
    }

    setLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(post ? "Artikel berhasil diperbarui!" : "Artikel berhasil dibuat!")
      router.push("/admin/blog")
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div className="rounded-2xl border bg-card p-6 space-y-6">
        <h2 className="font-semibold text-lg">Informasi Artikel</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1.5">Judul</label>
            <input
              name="title"
              defaultValue={post?.title}
              required
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
              onChange={(e) => {
                const slugInput = document.querySelector<HTMLInputElement>("input[name='slug']")
                if (slugInput && !post) {
                  slugInput.value = slugify(e.target.value)
                }
              }}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1.5">Slug</label>
            <input
              name="slug"
              defaultValue={post?.slug}
              required
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Excerpt (ringkasan)</label>
          <textarea
            name="excerpt"
            defaultValue={post?.excerpt || ""}
            rows={2}
            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Konten (HTML)</label>
          <textarea
            name="content"
            defaultValue={post?.content || ""}
            required
            rows={15}
            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary font-mono"
          />
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-6 space-y-6">
        <h2 className="font-semibold text-lg">Pengaturan</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1.5">Gambar URL</label>
            <input
              name="image_url"
              defaultValue={post?.image_url || ""}
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Tags (dipisah koma)</label>
            <input
              name="tags"
              defaultValue={post?.tags?.join(", ") || ""}
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
              placeholder="nextjs, react, tutorial"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Tanggal Publikasi</label>
          <input
            type="datetime-local"
            name="published_at"
            defaultValue={post?.published_at?.slice(0, 16) || ""}
            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            Kosongkan untuk menyimpan sebagai draft.
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 shadow-lg shadow-primary/25"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {post ? "Simpan Perubahan" : "Buat Artikel"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border px-6 py-3 text-sm font-medium hover:bg-muted transition-all duration-200"
        >
          Batal
        </button>
      </div>
    </form>
  )
}
