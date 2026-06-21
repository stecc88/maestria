import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"
import { validateAiResponse, fetchGeminiWithRetry } from "@/lib/gemini/client"
import { taskEvaluationSchema } from "@/lib/validations/ai"
import { calculateXpForTask } from "@/lib/utils/xp"
import { refreshStudentAchievements } from "@/lib/utils/achievements"
import { calculateNewStreak } from "@/lib/utils/streak"

export async function POST(request: Request) {
  const supabase = createClient()
  const adminSupabase = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 })
  }

  try {
    const { taskId, content } = await request.json()

    // 1. Get task details and exercise_content
    const { data: task, error: taskError } = await adminSupabase
      .from("tasks")
      .select("*, students(profiles(full_name))")
      .eq("id", taskId)
      .single()

    if (taskError || !task) throw new Error("Task non trovata")

    const exerciseContent = task.exercise_content
    const exerciseType = exerciseContent?.type || task.exercise_type

    let finalScore = 0
    let finalFeedback = ""
    let errorOvercome = false

    // 2. Evaluation Logic
    if (exerciseType === "completamento" || exerciseType === "trasformazione") {
      // Objective evaluation
      const studentAnswers = typeof content === 'string' ? JSON.parse(content) : content
      const items = exerciseContent.items || []
      let correctCount = 0

      items.forEach((item: any) => {
        const studentAns = studentAnswers[item.id.toString()]?.trim().toLowerCase()
        const correctAns = item.correct_answer.trim().toLowerCase()
        if (studentAns === correctAns) {
          correctCount++
        }
      })

      finalScore = Math.round((correctCount / items.length) * 100)
      errorOvercome = finalScore >= 80
      finalFeedback = `Hai risposto correttamente a ${correctCount} su ${items.length} quesiti. ${finalScore >= 80 ? 'Ottimo lavoro!' : 'Continua a fare pratica.'}`
    } else {
      // Subjective evaluation with Gemini (riscrittura, scrittura)
      const prompt = `IMPORTANTE: Rispondi SEMPRE e SOLO in italiano. Mai in spagnolo o altre lingue.

Sei un insegnante di italiano esperto.
Esercizio assegnato: "${task.exercise_instructions}"
Tipo di esercizio: "${exerciseType}"
Contenuto originale/Consegna: ${JSON.stringify(exerciseContent)}
Risposta dello studente: "${content}"

Valuta la risposta dello studente considerando:
1. Correttezza grammaticale.
2. Rispetto della consegna.
3. Superamento degli errori segnalati precedentemente: ${JSON.stringify(task.corrections?.error_categories || {})}.

Fornisci:
- Un punteggio da 0 a 100
- Un commento motivatore e pedagogico di 2-3 frasi IN ITALIANO.
- Un booleano che indica se ha superato l'errore principale (error_overcome).

Rispondi UNICAMENTE con JSON valido senza markdown: { "score": number, "feedback": string, "error_overcome": boolean }`

      const geminiResponse = await fetchGeminiWithRetry(
        `https://generativelanguage.googleapis.com/v1/models/gemini-3.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      )

      const geminiData = await geminiResponse.json()

      if (!geminiResponse.ok) {
        console.error("Gemini Task Check API Error Detail:", geminiData);
        const errorMsg = geminiData.error?.message || `AI Service Error (${geminiResponse.status})`;
        throw new Error(errorMsg);
      }
      const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || ""
      const geminiResult = await validateAiResponse(rawText, taskEvaluationSchema)

      if (!geminiResult) {
        throw new Error("Errore nella valutazione dell'IA")
      }

      finalScore = geminiResult.score
      finalFeedback = geminiResult.feedback
      errorOvercome = geminiResult.error_overcome
    }

    // 3. Save Submission
    const xpEarned = calculateXpForTask(finalScore)

    const { data: submission, error: subError } = await adminSupabase
      .from("task_submissions")
      .insert({
        task_id: taskId,
        student_id: user.id,
        content: typeof content === 'string' ? content : JSON.stringify(content),
        ai_feedback: finalFeedback,
        ai_score: finalScore,
        xp_earned: xpEarned
      })
      .select()
      .single()

    if (subError) throw subError

    // 4. Update Task status
    await adminSupabase
      .from("tasks")
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq("id", taskId)

    // 5. Update Student XP
    await adminSupabase.rpc("increment_xp", {
      student_id: user.id,
      xp_amount: xpEarned
    })

    // 5b. Actualizar racha y última actividad (completar una tarea también cuenta)
    const { data: studentBefore } = await adminSupabase
      .from("students")
      .select("streak_days, last_activity")
      .eq("id", user.id)
      .single()

    const newStreak = calculateNewStreak(studentBefore?.last_activity || null, studentBefore?.streak_days || 0)

    await adminSupabase
      .from("students")
      .update({
        last_activity: new Date().toISOString(),
        streak_days: newStreak
      })
      .eq("id", user.id)

    // 6. Notify Teacher
    const studentName = Array.isArray(task.students)
      ? (task.students[0] as any).profiles.full_name
      : (task.students as any).profiles.full_name

    await adminSupabase.from("notifications").insert({
      user_id: task.teacher_id,
      type: 'task_completed',
      title: '✅ Compito completato',
      message: `${studentName} ha completato il compito "${task.title}" con un punteggio di ${finalScore}/100`,
      related_id: taskId
    })

    const newAchievements = await refreshStudentAchievements(user.id)

    return NextResponse.json({
      score: finalScore,
      feedback: finalFeedback,
      error_overcome: errorOvercome,
      xp_earned: xpEarned,
      newAchievements
    })

  } catch (error: any) {
    console.error("Task check error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
