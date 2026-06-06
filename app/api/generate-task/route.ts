import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { safeParseJson } from "@/lib/gemini/client"

export async function POST(request: Request) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 })
  }

  try {
    const {
      studentId,
      writingId,
      errorType,
      errorDetail,
      exerciseType,
      additionalNotes,
      studentLevel
    } = await request.json()

    const prompt = `Sei un esperto in didattica dell'italiano per stranieri con ampia esperienza.
Lo studente ha un livello rilevato di: ${studentLevel}.
Ha commesso questo errore frequentemente: ${errorType} — nello specifico: ${errorDetail}.
Note aggiuntive dell'insegnante: ${additionalNotes || 'Nessuna'}.

Crea:
1. Una spiegazione teorica chiara e pedagogica della regola grammaticale o di uso correlata (in italiano, con esempi evidenziati).
2. Un esercizio di tipo "${exerciseType}" appropriato per il livello ${studentLevel}.
L'esercizio deve essere direttamente correlato a quell'errore specifico affinché lo studente possa esercitarsi.

Rispondi UNICAMENTE con un oggetto JSON (senza markdown) con questa struttura:
{
  "title": "Titolo accattivante per il compito",
  "theory_explanation": "Spiegazione dettagliata in formato markdown (usa il grassetto per gli esempi in italiano)",
  "exercise_instructions": "Istruzioni passo dopo passo per lo studente",
  "exercise_content": "Oggetto o stringa con il contenuto dell'esercizio in base al tipo (es: testo con [___] da completare, o lista di frasi)"
}`

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

    return NextResponse.json(geminiResult)

  } catch (error: any) {
    console.error("Error generating task:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
