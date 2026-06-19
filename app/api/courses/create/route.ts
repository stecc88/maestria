import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = createClient()
  const adminSupabase = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 })
  }

  const { name } = await request.json()
  if (!name) {
    return NextResponse.json({ error: "Nome corso richiesto" }, { status: 400 })
  }

  const { data: course, error } = await adminSupabase
    .from("courses")
    .insert({
      teacher_id: user.id,
      name
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ course })
}
