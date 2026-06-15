import { createClient } from "@/lib/supabase/server"
import { AdminSkillsClient } from "./client"

export default async function AdminSkillsPage() {
  const supabase = await createClient()

  const { data: skills } = await supabase
    .from("skills")
    .select("*")
    .order("category")
    .order("level", { ascending: false })

  return <AdminSkillsClient skills={skills || []} />
}
