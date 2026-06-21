import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 })

  try {
    const { studentId, courseId } = await request.json()
    if (!studentId) return NextResponse.json({ error: "ID studente mancante" }, { status: 400 })

    const adminSupabase = createAdminClient()

    // Verificar que el alumno pertenece a este profesor
    const { data: student } = await adminSupabase
      .from("students")
      .select("id, teacher_id")
      .eq("id", studentId)
      .single()

    if (!student || student.teacher_id !== user.id) {
      return NextResponse.json({ error: "Non autorizzato a modificare questo studente" }, { status: 403 })
    }

    // Si se especifica un curso, verificar que también pertenece a este profesor
    if (courseId) {
      const { data: course } = await adminSupabase
        .from("courses")
        .select("id, teacher_id")
        .eq("id", courseId)
        .single()

      if (!course || course.teacher_id !== user.id) {
        return NextResponse.json({ error: "Corso non valido" }, { status: 403 })
      }
    }

    const { error: updateError } = await adminSupabase
      .from("students")
      .update({ course_id: courseId || null })
      .eq("id", studentId)

    if (updateError) throw updateError

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error assigning course:", error)
    return NextResponse.json({ error: error.message || "Errore durante l'assegnazione del corso" }, { status: 500 })
  }
}
