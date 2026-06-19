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

  const { studentId, courseId } = await request.json()
  if (!studentId) {
    return NextResponse.json({ error: "ID studente richiesto" }, { status: 400 })
  }

  // Verify student belongs to teacher
  const { data: student, error: fetchError } = await adminSupabase
    .from("students")
    .select("id")
    .eq("id", studentId)
    .eq("teacher_id", user.id)
    .single()

  if (fetchError || !student) {
    return NextResponse.json({ error: "Studente non trovato o non autorizzato" }, { status: 404 })
  }

  // Verify course belongs to teacher if provided
  if (courseId) {
    const { data: course, error: courseError } = await adminSupabase
      .from("courses")
      .select("id")
      .eq("id", courseId)
      .eq("teacher_id", user.id)
      .single()

    if (courseError || !course) {
      return NextResponse.json({ error: "Corso non valido o non autorizzato" }, { status: 403 })
    }
  }

  // Update student course
  const { error: updateError } = await adminSupabase
    .from("students")
    .update({ course_id: courseId })
    .eq("id", studentId)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
