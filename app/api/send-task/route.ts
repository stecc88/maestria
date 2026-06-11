import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = createClient()
  const adminSupabase = createAdminClient()

  const { data: { user: teacherUser } } = await supabase.auth.getUser()
  if (!teacherUser) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", teacherUser.id)
    .single()

  try {
    const { studentId, task, writingId, exerciseType } = await request.json()

    // Map Italian UI types to database allowed values
    const typeMap: Record<string, string> = {
      'scrittura': 'escritura',
      'completamento': 'completar',
      'trasformazione': 'transformacion',
      'riscrittura': 'reescritura'
    }

    const dbType = typeMap[exerciseType] || 'completar'

    // 1. Save Task
    const { data: newTask, error: taskError } = await adminSupabase
      .from("tasks")
      .insert({
        student_id: studentId,
        teacher_id: teacherUser.id,
        correction_id: writingId || null,
        title: task.title,
        theory_explanation: task.theory_explanation,
        exercise_instructions: task.exercise_instructions,
        exercise_type: dbType,
        exercise_content: task.exercise_content,
        status: 'pending'
      })
      .select()
      .single()

    if (taskError) throw taskError

    // 2. Notify Student
    await adminSupabase.from("notifications").insert({
      user_id: studentId,
      type: 'new_task',
      title: '📝 Nuovo compito dal tuo insegnante',
      message: `Il Prof. ${profile?.full_name || teacherUser.user_metadata.full_name} ti ha inviato il compito "${task.title}". Al lavoro!`,
      related_id: newTask.id
    })

    return NextResponse.json({ success: true, id: newTask.id })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
