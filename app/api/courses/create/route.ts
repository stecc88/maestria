import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 })

  try {
    const { name } = await request.json()
    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Il nome del corso è obbligatorio" }, { status: 400 })
    }

    const adminSupabase = createAdminClient()

    const { data: course, error } = await adminSupabase
      .from("courses")
      .insert({ teacher_id: user.id, name: name.trim() })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ course })
  } catch (error: any) {
    console.error("Error creating course:", error)
    return NextResponse.json({ error: error.message || "Errore durante la creazione del corso" }, { status: 500 })
  }
}
