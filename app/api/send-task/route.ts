import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = createClient()

  const { data: { user: teacherUser } } = await supabase.auth.getUser()
  if (!teacherUser) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const { studentId, task, writingId } = await request.json()

    // 1. Save Task
    const { data: newTask, error: taskError } = await supabase
      .from("tasks")
      .insert({
        student_id: studentId,
        teacher_id: teacherUser.id,
        correction_id: null, // Logic to link if needed
        title: task.title,
        theory_explanation: task.theory_explanation,
        exercise_instructions: task.exercise_instructions,
        exercise_type: 'completar', // Defaulting for simplicity in this MVP action
        exercise_content: task.exercise_content,
        status: 'pending'
      })
      .select()
      .single()

    if (taskError) throw taskError

    // 2. Notify Student
    await supabase.from("notifications").insert({
      user_id: studentId,
      type: 'new_task',
      title: '📝 Nueva tarea de tu profesor',
      message: `El Prof. ${teacherUser.user_metadata.full_name} te envió la tarea "${task.title}". ¡A trabajar!`,
      related_id: newTask.id
    })

    return NextResponse.json({ success: true, id: newTask.id })

  } catch (error: any) {
    console.error("Error sending task:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
