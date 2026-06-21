import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 })

  try {
    const { courseId } = await request.json()
    if (!courseId) return NextResponse.json({ error: "ID corso mancante" }, { status: 400 })

    const adminSupabase = createAdminClient()

    // Verificar que el curso pertenece al profesor autenticado
    const { data: course } = await adminSupabase
      .from("courses")
      .select("id, teacher_id")
      .eq("id", courseId)
      .single()

    if (!course || course.teacher_id !== user.id) {
      return NextResponse.json({ error: "Non autorizzato a eliminare questo corso" }, { status: 403 })
    }

    // Desvincular alumnos del curso antes de borrarlo (evitar huérfanos)
    await adminSupabase
      .from("students")
      .update({ course_id: null })
      .eq("course_id", courseId)

    const { error: deleteError } = await adminSupabase
      .from("courses")
      .delete()
      .eq("id", courseId)

    if (deleteError) throw deleteError

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting course:", error)
    return NextResponse.json({ error: error.message || "Errore durante l'eliminazione del corso" }, { status: 500 })
  }
}
