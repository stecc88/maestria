import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { calculateXpForTask } from "@/lib/utils/xp"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(request: Request) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const { taskId, content, error_categories, exercise_instructions } = await request.json()

    // 1. Evaluate with Gemini
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      generationConfig: { responseMimeType: "application/json" }
    })

    const prompt = `Eres un profesor de italiano experto.
El alumno tenía los siguientes errores en su escrito original: ${JSON.stringify(error_categories)}.
Se le asignó este ejercicio para practicar: "${exercise_instructions}"
La respuesta del alumno es: "${content}"

Evalúa si el alumno ha superado el error o si muestra una mejora significativa.
Proporciona:
- Un puntaje de 0 a 100
- Un comentario motivador y pedagógico de 2-3 oraciones en español.
- Un booleano indicando si superó el error principal (error_overcome).

Responde ÚNICAMENTE con este JSON: { "score": number, "feedback": string, "error_overcome": boolean }`

    const result = await model.generateContent(prompt)
    const geminiResponse = JSON.parse(result.response.text())

    // 2. Save Submission
    const xpEarned = calculateXpForTask(geminiResponse.score)

    const { data: submission, error: subError } = await supabase
      .from("task_submissions")
      .insert({
        task_id: taskId,
        student_id: user.id,
        content,
        ai_feedback: geminiResponse.feedback,
        ai_score: geminiResponse.score,
        xp_earned: xpEarned
      })
      .select()
      .single()

    if (subError) throw subError

    // 3. Update Task
    await supabase
      .from("tasks")
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq("id", taskId)

    // 4. Update Student XP
    const { data: student } = await supabase
      .from("students")
      .select("xp_points")
      .eq("id", user.id)
      .single()

    await supabase
      .from("students")
      .update({ xp_points: (student?.xp_points || 0) + xpEarned })
      .eq("id", user.id)

    // 5. Notify Teacher
    const { data: task } = await supabase
      .from("tasks")
      .select("title, teacher_id, student_id, students(profiles(full_name))")
      .eq("id", taskId)
      .single()

    if (task) {
      const studentName = (task.students as any).profiles.full_name
      await supabase.from("notifications").insert({
        user_id: task.teacher_id,
        type: 'task_completed',
        title: '✅ Tarea completada',
        message: `${studentName} completó la tarea "${task.title}" con un puntaje de ${geminiResponse.score}/100`,
        related_id: taskId
      })
    }

    return NextResponse.json({
      ...geminiResponse,
      xp_earned: xpEarned
    })

  } catch (error: any) {
    console.error("Error in check-task API:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
