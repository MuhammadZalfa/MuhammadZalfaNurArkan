import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { InfoIcon } from "lucide-react"

export default async function ProtectedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  return (
    <div className="flex-1 w-full flex flex-col gap-12 p-8">
      <div className="flex items-center gap-3 bg-accent text-sm p-3 px-5 rounded-md text-foreground">
        <InfoIcon size="16" strokeWidth={2} />
        Halaman ini hanya bisa diakses oleh user yang login.
      </div>
      <div>
        <h2 className="font-bold text-2xl mb-4">User Details</h2>
        <pre className="text-xs font-mono p-3 rounded border overflow-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
    </div>
  )
}
