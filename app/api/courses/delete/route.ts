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

  const { courseId } = await request.json()
  if (!courseId) {
    return NextResponse.json({ error: "ID corso richiesto" }, { status: 400 })
  }

  // Verify course ownership
  const { data: course, error: fetchError } = await adminSupabase
    .from("courses")
    .select("id")
    .eq("id", courseId)
    .eq("teacher_id", user.id)
    .single()

  if (fetchError || !course) {
    return NextResponse.json({ error: "Corso non trovato o non autorizzato" }, { status: 404 })
  }

  // Update students to nullify course_id before deletion
  await adminSupabase
    .from("students")
    .update({ course_id: null })
    .eq("course_id", courseId)

  // Delete course
  const { error: deleteError } = await adminSupabase
    .from("courses")
    .delete()
    .eq("id", courseId)

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
