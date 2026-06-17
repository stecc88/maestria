import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = createClient()
  const adminSupabase = createAdminClient()

  try {
    const body = await request.json()
    const {
      studentId,
      task,
      correctionId,
      exerciseType,
      title,
      theoryExplanation,
      exerciseInstructions,
      exerciseContent
    } = body

    // Support both direct task object or flat parameters
    const finalTask = task || {
      title,
      theory_explanation: theoryExplanation,
      exercise_instructions: exerciseInstructions,
      exercise_content: exerciseContent
    }

    if (!studentId || !finalTask || !exerciseType) {
      return NextResponse.json({ error: "Dati mancanti nel corpo della richiesta" }, { status: 400 })
    }

    const { data: { user: teacherUser } } = await supabase.auth.getUser()
    if (!teacherUser) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 })
    }

    const { data: profile } = await adminSupabase
      .from("profiles")
      .select("full_name")
      .eq("id", teacherUser.id)
      .single()

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
        correction_id: correctionId || null,
        title: finalTask.title || "Nuovo Compito",
        theory_explanation: finalTask.theory_explanation || "",
        exercise_instructions: finalTask.exercise_instructions || "",
        exercise_type: dbType,
        exercise_content: finalTask.exercise_content || {},
        status: 'pending'
      })
      .select()
      .single()

    if (taskError) {
      return NextResponse.json({ error: `Errore database: ${taskError.message}` }, { status: 500 })
    }

    // 2. Notify Student
    await adminSupabase.from("notifications").insert({
      user_id: studentId,
      type: 'new_task',
      title: '📝 Nuovo compito dal tuo insegnante',
      message: `Il Prof. ${profile?.full_name || teacherUser.user_metadata.full_name} ti ha inviato il compito "${finalTask.title}". Al lavoro!`,
      related_id: newTask.id
    })

    return NextResponse.json({ success: true, id: newTask.id })

  } catch (error: any) {
    return NextResponse.json({ error: error.message, details: error.toString() }, { status: 500 })
  }
}
