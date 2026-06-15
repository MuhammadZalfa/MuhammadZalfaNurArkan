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

  const stats = [
    { label: "Proyek", count: projectsCount || 0, icon: FolderOpen },
    { label: "Artikel Blog", count: postsCount || 0, icon: FileText },
    { label: "Pesan Masuk", count: contactsCount || 0, icon: Mail },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
      <p className="text-muted-foreground mb-8">
        Selamat datang, {user.email}
      </p>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="rounded-2xl border bg-card p-6 transition-all duration-200 hover:shadow-[0_0_25px_-5px] hover:shadow-primary/5 hover:border-primary/20"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.count}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="rounded-2xl border bg-card">
        <div className="p-5 border-b">
          <h2 className="font-semibold flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            Pesan Terbaru
          </h2>
        </div>
        <div className="divide-y">
          {recentContacts && recentContacts.length > 0 ? (
            recentContacts.map((contact) => (
              <div key={contact.id} className="p-5 transition-colors hover:bg-muted/30">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="font-medium text-sm">{contact.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {contact.email}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 ml-9">
                  {contact.message}
                </p>
              </div>
            ))
          ) : (
            <p className="p-5 text-sm text-muted-foreground text-center">
              Belum ada pesan.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
