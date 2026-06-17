import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { fetchGeminiWithRetry } from "@/lib/gemini/client"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 })

  try {
    const { exerciseId, answers } = await request.json()
    const adminSupabase = createAdminClient()

    // 1. Fetch exercise and solutions
    const { data: exercise, error: fetchError } = await adminSupabase
      .from("structure_exercises")
      .select("*")
      .eq("id", exerciseId)
      .single()

    if (fetchError || !exercise) throw new Error("Esercizio non trovato")

    // 2. Compare answers
    const blankFeedback: any[] = []
    let correctCount = 0
    const solutionsSource = exercise.exercise_type === "situazionale" ? exercise.solutions.items : exercise.solutions.blanks
    const total = solutionsSource.length

    solutionsSource.forEach((sol: any) => {
      const studentAns = (answers[sol.id.toString()] || "").trim().toLowerCase()
      const correctAns = sol.correct_answer.trim().toLowerCase()
      const isCorrect = studentAns === correctAns

      if (isCorrect) correctCount++

      blankFeedback.push({
        id: sol.id,
        isCorrect,
        studentAnswer: answers[sol.id.toString()],
        correctAnswer: sol.correct_answer,
        explanation: sol.explanation
      })
    })

    const score = Math.round((correctCount / total) * 100)
    const wrongAnswers = blankFeedback.filter(f => !f.isCorrect)

    // 3. Generate general feedback with Gemini
    const prompt = `Sei un insegnante di italiano esperto e incoraggiante. Uno studente ha appena completato un esercizio di livello ${exercise.level} sul tema ${exercise.exercise_type}, ottenendo un punteggio di ${score}/100.

    ${wrongAnswers.length > 0
      ? `Ha sbagliato questi punti: ${JSON.stringify(wrongAnswers.map(w => ({ id: w.id, explanation: w.explanation })))}`
      : "Ha risposto correttamente a tutto!"}

    Scrivi un feedback finale breve (4-5 frasi) in italiano semplice, che:
    - Riconosca i punti di forza dello studente
    - Identifichi il pattern principale degli errori (se c'è una regola che lo studente non ha capito bene)
    - Dia un consiglio di studio concreto e specifico
    - Sia incoraggiante e motivante

    Rispondi SOLO con il testo del feedback, senza JSON, senza markdown.`

    const geminiResponse = await fetchGeminiWithRetry(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    )

    const geminiData = await geminiResponse.json()
    const generalFeedback = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "Ottimo lavoro con l'esercizio!"

    // 4. Save attempt
    const { error: attemptError } = await adminSupabase
      .from("structure_exercise_attempts")
      .insert({
        exercise_id: exerciseId,
        student_id: user.id,
        answers,
        score,
        feedback: {
          blank_feedback: blankFeedback,
          general_feedback: generalFeedback
        }
      })

    if (attemptError) throw attemptError

    // 5. Update student XP (Optional but recommended)
    const xpEarned = Math.floor(score / 2) // Simple logic: 50 XP max
    if (xpEarned > 0) {
      await adminSupabase.rpc("increment_xp", {
        student_id: user.id,
        xp_amount: xpEarned
      })
    }

    return NextResponse.json({
      score,
      blank_feedback: blankFeedback,
      general_feedback: generalFeedback,
      xpEarned
    })

  } catch (error: any) {
    console.error("Exercise Correction Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
