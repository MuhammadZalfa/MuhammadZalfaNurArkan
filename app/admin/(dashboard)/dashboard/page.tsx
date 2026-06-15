import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { FolderOpen, FileText, Mail, User } from "lucide-react"

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/admin/login")

  const { count: projectsCount } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })

  const { count: postsCount } = await supabase
    .from("blog_posts")
    .select("*", { count: "exact", head: true })

  const { count: contactsCount } = await supabase
    .from("contacts")
    .select("*", { count: "exact", head: true })

  const { data: recentContacts } = await supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
      <p className="text-muted-foreground mb-8">
        Selamat datang, {user.email}
      </p>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <FolderOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Proyek</p>
              <p className="text-2xl font-bold">{projectsCount || 0}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Artikel Blog</p>
              <p className="text-2xl font-bold">{postsCount || 0}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pesan Masuk</p>
              <p className="text-2xl font-bold">{contactsCount || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card">
        <div className="p-5 border-b">
          <h2 className="font-semibold">Pesan Terbaru</h2>
        </div>
        <div className="divide-y">
          {recentContacts && recentContacts.length > 0 ? (
            recentContacts.map((contact) => (
              <div key={contact.id} className="p-5">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{contact.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {contact.email}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {contact.message}
                </p>
              </div>
            ))
          ) : (
            <p className="p-5 text-sm text-muted-foreground">Belum ada pesan.</p>
          )}
        </div>
      </div>
    </div>
  )
}
