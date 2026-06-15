"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Pencil, Trash2, X, Check, Briefcase, GraduationCap } from "lucide-react"
import { createExperience, updateExperience, deleteExperience, createEducation, updateEducation, deleteEducation } from "@/lib/admin"
import toast from "react-hot-toast"
import type { Experience, Education } from "@/lib/types"

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toISOString().slice(0, 7)
}

interface AdminResumeClientProps {
  experiences: Experience[]
  educations: Education[]
}

export function AdminResumeClient({ experiences: initialExps, educations: initialEds }: AdminResumeClientProps) {
  const router = useRouter()
  const [experiences, setExperiences] = useState(initialExps)
  const [educations, setEducations] = useState(initialEds)
  const [editingExp, setEditingExp] = useState<string | "new" | null>(null)
  const [editingEdu, setEditingEdu] = useState<string | "new" | null>(null)

  async function handleExpSubmit(e: React.FormEvent<HTMLFormElement>, id?: string) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const techInput = (formData.get("tech_stack") as string) || ""
    formData.set("tech_stack", JSON.stringify(techInput.split(",").map((t: string) => t.trim()).filter(Boolean)))

    const res = id
      ? await updateExperience(id, formData)
      : await createExperience(formData)

    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success(id ? "Pengalaman diperbarui!" : "Pengalaman ditambahkan!")
      setEditingExp(null)
      router.refresh()
    }
  }

  async function handleExpDelete(id: string) {
    if (!confirm("Hapus pengalaman ini?")) return
    const res = await deleteExperience(id)
    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success("Pengalaman dihapus!")
      setExperiences((prev) => prev.filter((e) => e.id !== id))
      router.refresh()
    }
  }

  async function handleEduSubmit(e: React.FormEvent<HTMLFormElement>, id?: string) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    const res = id
      ? await updateEducation(id, formData)
      : await createEducation(formData)

    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success(id ? "Pendidikan diperbarui!" : "Pendidikan ditambahkan!")
      setEditingEdu(null)
      router.refresh()
    }
  }

  async function handleEduDelete(id: string) {
    if (!confirm("Hapus pendidikan ini?")) return
    const res = await deleteEducation(id)
    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success("Pendidikan dihapus!")
      setEducations((prev) => prev.filter((e) => e.id !== id))
      router.refresh()
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <Briefcase className="h-6 w-6 text-primary" />
        Resume
      </h1>

      {/* ── Experiences ── */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Pengalaman
          </h2>
          <button
            onClick={() => setEditingExp("new")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/25"
          >
            <Plus className="h-3.5 w-3.5" /> Tambah
          </button>
        </div>

        <div className="rounded-2xl border bg-card overflow-hidden">
          {editingExp === "new" && (
            <ExpForm onSubmit={(e) => handleExpSubmit(e)} onCancel={() => setEditingExp(null)} />
          )}
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">Posisi / Perusahaan</th>
                <th className="text-left p-3 font-medium hidden md:table-cell">Periode</th>
                <th className="text-right p-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {experiences.length === 0 && editingExp !== "new" && (
                <tr>
                  <td colSpan={3} className="p-6 text-center text-muted-foreground">
                    Belum ada pengalaman.
                  </td>
                </tr>
              )}
              {experiences.map((exp) => (
                editingExp === exp.id ? (
                  <tr key={exp.id}>
                    <td colSpan={3} className="p-3">
                      <ExpForm
                        exp={exp}
                        onSubmit={(e) => handleExpSubmit(e, exp.id)}
                        onCancel={() => setEditingExp(null)}
                      />
                    </td>
                  </tr>
                ) : (
                  <tr key={exp.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3">
                      <p className="font-medium">{exp.title}</p>
                      {exp.company && <p className="text-xs text-muted-foreground">{exp.company}</p>}
                    </td>
                    <td className="p-3 hidden md:table-cell text-muted-foreground text-xs">
                      {formatDate(exp.start_date)} — {exp.current ? "Sekarang" : exp.end_date ? formatDate(exp.end_date) : ""}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setEditingExp(exp.id)} className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Edit">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleExpDelete(exp.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors" title="Hapus">
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

      {/* ── Educations ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Pendidikan
          </h2>
          <button
            onClick={() => setEditingEdu("new")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/25"
          >
            <Plus className="h-3.5 w-3.5" /> Tambah
          </button>
        </div>

        <div className="rounded-2xl border bg-card overflow-hidden">
          {editingEdu === "new" && (
            <EduForm onSubmit={(e) => handleEduSubmit(e)} onCancel={() => setEditingEdu(null)} />
          )}
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">Institusi / Gelar</th>
                <th className="text-left p-3 font-medium hidden md:table-cell">Tahun</th>
                <th className="text-right p-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {educations.length === 0 && editingEdu !== "new" && (
                <tr>
                  <td colSpan={3} className="p-6 text-center text-muted-foreground">
                    Belum ada pendidikan.
                  </td>
                </tr>
              )}
              {educations.map((edu) => (
                editingEdu === edu.id ? (
                  <tr key={edu.id}>
                    <td colSpan={3} className="p-3">
                      <EduForm
                        edu={edu}
                        onSubmit={(e) => handleEduSubmit(e, edu.id)}
                        onCancel={() => setEditingEdu(null)}
                      />
                    </td>
                  </tr>
                ) : (
                  <tr key={edu.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3">
                      <p className="font-medium">{edu.institution}</p>
                      {edu.degree && <p className="text-xs text-muted-foreground">{edu.degree}</p>}
                    </td>
                    <td className="p-3 hidden md:table-cell text-muted-foreground text-xs">
                      {edu.start_year} — {edu.current ? "Sekarang" : edu.end_year || ""}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setEditingEdu(edu.id)} className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Edit">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleEduDelete(edu.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors" title="Hapus">
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

// ── Experience Form ──

function ExpForm({
  exp,
  onSubmit,
  onCancel,
}: {
  exp?: Experience
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onCancel: () => void
}) {
  return (
    <form onSubmit={onSubmit} className="p-4 space-y-3 bg-muted/20 border-b">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          name="title"
          defaultValue={exp?.title || ""}
          required
          placeholder="Posisi"
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <input
          name="company"
          defaultValue={exp?.company || ""}
          placeholder="Perusahaan"
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <input
          name="location"
          defaultValue={exp?.location || ""}
          placeholder="Lokasi"
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <input
          name="tech_stack"
          defaultValue={exp?.tech_stack?.join(", ") || ""}
          placeholder="Tech stack (dipisah koma)"
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <div>
          <label className="block text-[10px] font-medium text-muted-foreground mb-1">Mulai</label>
          <input
            name="start_date"
            type="date"
            defaultValue={exp?.start_date?.slice(0, 10) || ""}
            required
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-muted-foreground mb-1">Selesai</label>
          <input
            name="end_date"
            type="date"
            defaultValue={exp?.end_date?.slice(0, 10) || ""}
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>
      <textarea
        name="description"
        defaultValue={exp?.description || ""}
        rows={2}
        placeholder="Deskripsi"
        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring resize-none"
      />
      <label className="flex items-center gap-2 text-xs cursor-pointer">
        <input
          type="checkbox"
          name="current"
          defaultChecked={exp?.current || false}
          className="rounded"
        />
        Masih berlangsung
      </label>
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

// ── Education Form ──

function EduForm({
  edu,
  onSubmit,
  onCancel,
}: {
  edu?: Education
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onCancel: () => void
}) {
  return (
    <form onSubmit={onSubmit} className="p-4 space-y-3 bg-muted/20 border-b">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <input
            name="institution"
            defaultValue={edu?.institution || ""}
            required
            placeholder="Nama Institusi"
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <input
          name="degree"
          defaultValue={edu?.degree || ""}
          placeholder="Gelar (S1, D3, dll)"
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <input
          name="field_of_study"
          defaultValue={edu?.field_of_study || ""}
          placeholder="Jurusan"
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <div>
          <label className="block text-[10px] font-medium text-muted-foreground mb-1">Tahun Mulai</label>
          <input
            name="start_year"
            type="number"
            defaultValue={edu?.start_year?.toString() || ""}
            required
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-muted-foreground mb-1">Tahun Selesai</label>
          <input
            name="end_year"
            type="number"
            defaultValue={edu?.end_year?.toString() || ""}
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>
      <textarea
        name="description"
        defaultValue={edu?.description || ""}
        rows={2}
        placeholder="Catatan (IPK, prestasi, dll)"
        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring resize-none"
      />
      <label className="flex items-center gap-2 text-xs cursor-pointer">
        <input
          type="checkbox"
          name="current"
          defaultChecked={edu?.current || false}
          className="rounded"
        />
        Masih berlangsung
      </label>
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
