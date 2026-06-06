import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"
import { safeParseJson } from "@/lib/gemini/client"
import { calculateXpForTask } from "@/lib/utils/xp"

export async function POST(request: Request) {
  const supabase = createClient()
  const adminSupabase = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 })
  }

  try {
    const { taskId, content, error_categories, exercise_instructions } = await request.json()

    // 1. Evaluate with Gemini
    const prompt = `IMPORTANTE: Rispondi SEMPRE e SOLO in italiano. Mai in spagnolo o altre lingue.

Sei un insegnante di italiano esperto.
Lo studente aveva i seguenti errori nello scritto originale: ${JSON.stringify(error_categories)}.
Gli è stato assegnato questo esercizio per fare pratica: "${exercise_instructions}"
La risposta dello studente è: "${content}"

Valuta se lo studente ha superato l'errore o se mostra un miglioramento significativo.
Fornisci:
- Un punteggio da 0 a 100
- Un commento motivatore e pedagogico di 2-3 frasi IN ITALIANO.
- Un booleano che indica se ha superato l'errore principale (error_overcome).

Rispondi UNICAMENTE con JSON valido senza markdown: { "score": number, "feedback": string (IN ITALIANO), "error_overcome": boolean }`

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    )

    const geminiData = await geminiResponse.json()
    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || ""
    const geminiResult = safeParseJson(rawText)

    if (!geminiResult) {
      return NextResponse.json({ error: "L'IA ha restituito un formato non valido" }, { status: 500 })
    }

    // 2. Save Submission
    const xpEarned = calculateXpForTask(geminiResult.score)

    const { data: submission, error: subError } = await adminSupabase
      .from("task_submissions")
      .insert({
        task_id: taskId,
        student_id: user.id,
        content,
        ai_feedback: geminiResult.feedback,
        ai_score: geminiResult.score,
        xp_earned: xpEarned
      })
      .select()
      .single()

    if (subError) throw subError

    // 3. Update Task
    await adminSupabase
      .from("tasks")
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq("id", taskId)

    // 4. Update Student XP
    const { error: rpcError } = await adminSupabase.rpc("increment_xp", {
      student_id: user.id,
      xp_amount: xpEarned
    })

    if (rpcError) {
      console.error("Error calling increment_xp RPC in check-task:", rpcError)
    }

    // 5. Notify Teacher
    const { data: task } = await adminSupabase
      .from("tasks")
      .select("title, teacher_id, student_id, students(profiles(full_name))")
      .eq("id", taskId)
      .single()

    if (task) {
      const studentName = Array.isArray(task.students)
        ? (task.students[0] as any).profiles.full_name
        : (task.students as any).profiles.full_name

      await adminSupabase.from("notifications").insert({
        user_id: task.teacher_id,
        type: 'task_completed',
        title: '✅ Compito completato',
        message: `${studentName} ha completato il compito "${task.title}" con un punteggio di ${geminiResult.score}/100`,
        related_id: taskId
      })
    }

    return NextResponse.json({
      ...geminiResult,
      xp_earned: xpEarned
    })

  } catch (error: any) {
    console.error("Error in check-task API:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
