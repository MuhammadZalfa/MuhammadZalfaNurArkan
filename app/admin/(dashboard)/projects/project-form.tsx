"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { createProject, updateProject } from "@/lib/admin"
import { Loader2, Upload } from "lucide-react"
import toast from "react-hot-toast"
import type { Project } from "@/lib/types"

interface ProjectFormProps {
  project?: Project
}

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState(project?.image_url || "")

  function slugify(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const supabase = createClient()
    const ext = file.name.split(".").pop()
    const fileName = `${crypto.randomUUID()}.${ext}`

    const { error } = await supabase.storage
      .from("project-images")
      .upload(fileName, file)

    if (error) {
      toast.error("Gagal upload gambar: " + error.message)
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from("project-images")
      .getPublicUrl(fileName)

    setImageUrl(publicUrl)
    setUploading(false)
    toast.success("Gambar berhasil diupload!")
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = e.currentTarget
    const formData = new FormData(form)

    if (imageUrl) {
      formData.set("image_url", imageUrl)
    }

    const techInput = (formData.get("tech_stack") as string) || ""
    formData.set("tech_stack", JSON.stringify(techInput.split(",").map((t: string) => t.trim()).filter(Boolean)))

    let result: { error?: string }
    if (project) {
      result = await updateProject(project.id, formData)
    } else {
      result = await createProject(formData)
    }

    setLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(project ? "Proyek berhasil diperbarui!" : "Proyek berhasil dibuat!")
      router.push("/admin/projects")
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div className="rounded-2xl border bg-card p-6 space-y-6">
        <h2 className="font-semibold text-lg">Informasi Proyek</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1.5">Judul</label>
            <input
              name="title"
              defaultValue={project?.title}
              required
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
              onChange={(e) => {
                const slugInput = document.querySelector<HTMLInputElement>("input[name='slug']")
                if (slugInput && !project) {
                  slugInput.value = slugify(e.target.value)
                }
              }}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1.5">Slug</label>
            <input
              name="slug"
              defaultValue={project?.slug}
              required
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Kategori</label>
            <input
              name="category"
              defaultValue={project?.category || ""}
              required
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
              placeholder="web, mobile, etc."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Tech Stack (dipisah koma)</label>
            <input
              name="tech_stack"
              defaultValue={project?.tech_stack?.join(", ") || ""}
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
              placeholder="React, Node.js, Tailwind"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Gambar</label>
          <div className="flex items-center gap-4">
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Preview"
                className="h-20 w-32 rounded-xl object-cover border"
              />
            )}
            <label className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm cursor-pointer hover:bg-muted transition-all duration-200">
              <Upload className="h-4 w-4" />
              {uploading ? "Uploading..." : "Upload Gambar"}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Deskripsi Singkat</label>
          <textarea
            name="description"
            defaultValue={project?.description || ""}
            required
            rows={3}
            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Konten Lengkap (HTML)</label>
          <textarea
            name="content"
            defaultValue={project?.content || ""}
            required
            rows={10}
            className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary font-mono"
          />
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-6 space-y-6">
        <h2 className="font-semibold text-lg">Tautan & Pengaturan</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1.5">Live Demo URL</label>
            <input
              name="live_url"
              defaultValue={project?.live_url || ""}
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Repo URL</label>
            <input
              name="repo_url"
              defaultValue={project?.repo_url || ""}
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
              placeholder="https://github.com/..."
            />
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="is_featured"
            id="is_featured"
            defaultChecked={project?.is_featured || false}
            className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
          />
          <span className="text-sm font-medium">
            Tampilkan sebagai proyek unggulan
          </span>
        </label>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 shadow-lg shadow-primary/25"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {project ? "Simpan Perubahan" : "Buat Proyek"}
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
