import { createClient } from "@/lib/supabase/server"
import { AdminResumeClient } from "./client"

export default async function AdminResumePage() {
  const supabase = await createClient()

  const { data: experiences } = await supabase
    .from("experiences")
    .select("*")
    .order("start_date", { ascending: false })

  const { data: educations } = await supabase
    .from("educations")
    .select("*")
    .order("start_year", { ascending: false })

  return (
    <AdminResumeClient
      experiences={experiences || []}
      educations={educations || []}
    />
  )
}
