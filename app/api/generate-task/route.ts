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
      exerciseType,
      errorCategories,
      studentLevel
    } = await request.json()

    const prompt = `IMPORTANTE: Rispondi SEMPRE e SOLO in italiano. Mai in spagnolo o altre lingue.

Sei un esperto di didattica dell'italiano per stranieri.
Lo studente di livello ${studentLevel} ha commesso questi errori nel suo testo:
${JSON.stringify(errorCategories, null, 2)}

Analizza questi errori e crea:
1. Una spiegazione teorica chiara e pedagogica della regola grammaticale principale (in italiano semplice, con esempi evidenziati in grassetto).
2. Un esercizio di tipo "${exerciseType}" appropriato per il livello ${studentLevel} che lavori specificamente su quell'errore.

Rispondi UNICAMENTE con un oggetto JSON valido senza markdown, esattamente con questa struttura:
{
  "title": "Titolo accattivante in italiano",
  "theory_explanation": "Spiegazione teorica in formato markdown (usa il grassetto per gli esempi)",
  "exercise_instructions": "Istruzioni passo dopo passo per lo studente",
  "exercise_content": "Oggetto o stringa con il contenuto dell'esercizio (es: testo con [___] o lista di frasi)",
  "error_focus": "Breve descrizione dell'errore principale su cui si focalizza il compito"
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
