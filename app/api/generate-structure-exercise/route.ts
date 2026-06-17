import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { fetchGeminiWithRetry } from "@/lib/gemini/client"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 })

  try {
    const { level, exercise_type } = await request.json()
    let prompt = ""

    if (exercise_type === "aggettivi_pronomi" || exercise_type === "verbi") {
      prompt = `Sei un esperto di didattica dell'italiano L2, livello CILS ${level}. Crea un testo autentico e coerente di circa 200-250 parole su un argomento interessante e adatto al livello ${level}, con ESATTAMENTE 15 spazi vuoti numerati dove lo studente deve inserire ${exercise_type === 'verbi' ? 'la forma corretta del verbo indicato tra parentesi' : 'l\'aggettivo o il pronome corretto'}.

Rispondi SOLO con JSON valido in questo formato esatto:
{
  "title": "titolo del testo",
  "theory": "spiegazione teorica completa in markdown su come e quando usare ${exercise_type === 'verbi' ? 'i tempi verbali richiesti' : 'aggettivi e pronomi'} al livello ${level}, con esempi chiari, simile a una pagina di grammatica didattica",
  "text_with_placeholders": "testo completo con {{1}}, {{2}}, ecc. al posto degli spazi",
  "blanks": [
    { "id": 1, "hint": "(verbo all'infinito se è prova di verbi, altrimenti vuoto)", "correct_answer": "risposta corretta", "explanation": "spiegazione grammaticale del perché questa è la risposta corretta" }
  ]
}`
    } else if (exercise_type === "scelta_multipla") {
      prompt = `Sei un esperto di didattica dell'italiano L2, livello CILS ${level}. Crea un testo di circa 200 parole con ESATTAMENTE 15 spazi numerati, dove per ognuno lo studente deve scegliere tra 4 opzioni (a, b, c, d) quella corretta.

Rispondi SOLO con JSON valido:
{
  "title": "titolo del testo",
  "theory": "spiegazione teorica in markdown sul tipo di lessico/struttura testata al livello ${level}",
  "text_with_placeholders": "testo con {{1}}, {{2}}, ecc.",
  "blanks": [
    { "id": 1, "options": {"a": "...", "b": "...", "c": "...", "d": "..."}, "correct_answer": "c", "explanation": "perché questa è la risposta corretta e perché le altre sono sbagliate" }
  ]
}`
    } else if (exercise_type === "situazionale") {
      prompt = `Sei un esperto di didattica dell'italiano L2, livello CILS ${level}. Crea ESATTAMENTE 8 brevi espressioni o frasi (annunci, messaggi, conversazioni) tipiche della vita quotidiana, e per ognuna 4 possibili situazioni comunicative (a, b, c, d) tra cui scegliere quella corretta.

Rispondi SOLO con JSON valido:
{
  "title": "titolo dell'esercizio",
  "theory": "spiegazione teorica in markdown su come riconoscere il contesto comunicativo e il registro linguistico al livello ${level}",
  "items": [
    { "id": 1, "statement": "l'espressione o l'annuncio", "options": {"a": "...", "b": "...", "c": "...", "d": "..."}, "correct_answer": "c", "explanation": "perché questa è la situazione corretta" }
  ]
}`
    }

    const geminiResponse = await fetchGeminiWithRetry(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    )

    const geminiData = await geminiResponse.json()
    if (!geminiResponse.ok) throw new Error(geminiData.error?.message || "Errore Gemini")

    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || ""
    const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim()
    const exerciseData = JSON.parse(cleanJson)

    // Prepare content for frontend (remove answers)
    const frontendContent = { ...exerciseData }
    const solutions: any = {}

    if (exercise_type === "situazionale") {
      solutions.items = exerciseData.items.map((item: any) => ({
        id: item.id,
        correct_answer: item.correct_answer,
        explanation: item.explanation
      }))
      frontendContent.items = exerciseData.items.map((item: any) => {
        const { correct_answer, explanation, ...rest } = item
        return rest
      })
    } else {
      solutions.blanks = exerciseData.blanks.map((blank: any) => ({
        id: blank.id,
        correct_answer: blank.correct_answer,
        explanation: blank.explanation
      }))
      frontendContent.blanks = exerciseData.blanks.map((blank: any) => {
        const { correct_answer, explanation, ...rest } = blank
        return rest
      })
    }

    const adminSupabase = createAdminClient()
    const { data: exercise, error: insertError } = await adminSupabase
      .from("structure_exercises")
      .insert({
        student_id: user.id,
        level,
        exercise_type,
        title: exerciseData.title,
        theory: exerciseData.theory,
        content: frontendContent,
        solutions: solutions
      })
      .select()
      .single()

    if (insertError) throw insertError

    return NextResponse.json({ exerciseId: exercise.id })

  } catch (error: any) {
    console.error("Exercise Generation Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
