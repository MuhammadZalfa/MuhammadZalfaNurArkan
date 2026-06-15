import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Plus, ExternalLink, Github, Pencil, Trash2 } from "lucide-react"
import { deleteProject } from "@/lib/admin"
import { formatDate } from "@/lib/utils"

export default async function AdminProjectsPage() {
  const supabase = await createClient()
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Proyek</h1>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> Tambah Proyek
        </Link>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium">Judul</th>
              <th className="text-left p-4 font-medium hidden md:table-cell">Kategori</th>
              <th className="text-left p-4 font-medium hidden md:table-cell">Featured</th>
              <th className="text-left p-4 font-medium hidden lg:table-cell">Tanggal</th>
              <th className="text-right p-4 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {projects?.map((project) => (
              <tr key={project.id} className="hover:bg-muted/30">
                <td className="p-4">
                  <p className="font-medium">{project.title}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[250px]">
                    {project.description}
                  </p>
                </td>
                <td className="p-4 hidden md:table-cell">
                  <span className="px-2 py-1 rounded-md text-xs bg-primary/10 text-primary">
                    {project.category}
                  </span>
                </td>
                <td className="p-4 hidden md:table-cell">
                  {project.is_featured ? (
                    <span className="text-xs text-secondary font-medium">Yes</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">No</span>
                  )}
                </td>
                <td className="p-4 hidden lg:table-cell text-muted-foreground">
                  {formatDate(project.created_at)}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {project.live_url && (
                      <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="p-2 hover:text-primary">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    {project.repo_url && (
                      <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="p-2 hover:text-primary">
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                    <Link href={`/admin/projects/${project.id}/edit`} className="p-2 hover:text-primary">
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <form action={async () => {
                      "use server"
                      await deleteProject(project.id)
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
        {(!projects || projects.length === 0) && (
          <p className="p-8 text-center text-sm text-muted-foreground">
            Belum ada proyek.{" "}
            <Link href="/admin/projects/new" className="text-primary hover:underline">
              Tambah proyek pertama
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
