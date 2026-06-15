import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 })
    }

    if (name.length < 2 || message.length < 10) {
      return NextResponse.json({ error: "Input tidak valid" }, { status: 400 })
    }

    const supabase = await createClient()
    const { error } = await supabase.from("contacts").insert({ name, email, message })

    if (error) {
      console.error("Contact insert error:", error)
      return NextResponse.json({ error: "Gagal menyimpan pesan" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
