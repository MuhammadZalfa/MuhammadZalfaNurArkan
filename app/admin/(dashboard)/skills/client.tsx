"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Pencil, Trash2, X, Check, Code2 } from "lucide-react"
import { createSkill, updateSkill, deleteSkill } from "@/lib/admin"
import toast from "react-hot-toast"
import type { Skill } from "@/lib/types"

interface AdminSkillsClientProps {
  skills: Skill[]
}

export function AdminSkillsClient({ skills: initialSkills }: AdminSkillsClientProps) {
  const router = useRouter()
  const [skills, setSkills] = useState(initialSkills)
  const [editingId, setEditingId] = useState<string | "new" | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>, id?: string) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    const res = id
      ? await updateSkill(id, formData)
      : await createSkill(formData)

    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success(id ? "Skill diperbarui!" : "Skill ditambahkan!")
      setEditingId(null)
      router.refresh()
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus skill ini?")) return
    const res = await deleteSkill(id)
    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success("Skill dihapus!")
      setSkills((prev) => prev.filter((s) => s.id !== id))
      router.refresh()
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <Code2 className="h-6 w-6 text-primary" />
        Skill
      </h1>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Code2 className="h-5 w-5 text-primary" />
            Daftar Skill
          </h2>
          <button
            onClick={() => setEditingId("new")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/25"
          >
            <Plus className="h-3.5 w-3.5" /> Tambah
          </button>
        </div>

        <div className="rounded-2xl border bg-card overflow-hidden">
          {editingId === "new" && (
            <SkillForm onSubmit={(e) => handleSubmit(e)} onCancel={() => setEditingId(null)} />
          )}
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">Nama</th>
                <th className="text-left p-3 font-medium hidden md:table-cell">Kategori</th>
                <th className="text-left p-3 font-medium hidden md:table-cell">Level</th>
                <th className="text-right p-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {skills.length === 0 && editingId !== "new" && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-muted-foreground">
                    Belum ada skill.
                  </td>
                </tr>
              )}
              {skills.map((skill) => (
                editingId === skill.id ? (
                  <tr key={skill.id}>
                    <td colSpan={4} className="p-3">
                      <SkillForm
                        skill={skill}
                        onSubmit={(e) => handleSubmit(e, skill.id)}
                        onCancel={() => setEditingId(null)}
                      />
                    </td>
                  </tr>
                ) : (
                  <tr key={skill.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3">
                      <p className="font-medium">{skill.name}</p>
                    </td>
                    <td className="p-3 hidden md:table-cell">
                      <span className="px-2.5 py-1 rounded-lg text-xs bg-primary/10 text-primary font-medium capitalize">
                        {skill.category}
                      </span>
                    </td>
                    <td className="p-3 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{skill.level}%</span>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setEditingId(skill.id)} className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Edit">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(skill.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors" title="Hapus">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function SkillForm({
  skill,
  onSubmit,
  onCancel,
}: {
  skill?: Skill
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onCancel: () => void
}) {
  return (
    <form onSubmit={onSubmit} className="p-4 space-y-3 bg-muted/20 border-b">
      <div className="grid gap-3 sm:grid-cols-3">
        <input
          name="name"
          defaultValue={skill?.name || ""}
          required
          placeholder="Nama skill"
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <input
          name="category"
          defaultValue={skill?.category || ""}
          required
          placeholder="Kategori (frontend, backend, dll)"
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <div>
          <label className="block text-[10px] font-medium text-muted-foreground mb-1">Level (1-100)</label>
          <input
            name="level"
            type="number"
            min={1}
            max={100}
            defaultValue={skill?.level?.toString() || ""}
            required
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="inline-flex items-center gap-1 rounded-xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
        >
          <Check className="h-3.5 w-3.5" /> Simpan
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1 rounded-xl border px-4 py-2 text-xs font-medium hover:bg-muted transition-all"
        >
          <X className="h-3.5 w-3.5" /> Batal
        </button>
      </div>
    </form>
  )
}
