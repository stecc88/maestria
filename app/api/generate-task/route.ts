import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { validateAiResponse, fetchGeminiWithRetry } from "@/lib/gemini/client"
import { taskGenerationSchema } from "@/lib/validations/ai"

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

IMPORTANTE: Se stai generando un compito "simile" a uno precedente, genera un nuovo esercizio completamente diverso da quello precedente, ma che lavori sullo stesso errore grammaticale e usi lo stesso tipo di esercizio. Usa frasi, esempi e contesti DIVERSI dal compito originale.

Genera il campo exercise_content seguendo SEMPRE questa struttura esatta in base al tipo richiesto:

Se tipo è 'completamento':
{
  "type": "completamento",
  "items": [
    { "id": 1, "sentence_before": "testo prima dello spazio", "sentence_after": "testo dopo lo spazio", "correct_answer": "risposta corretta", "options": ["opzione1", "opzione2", "opzione3"] }
  ]
}
DEVI generare ESATTAMENTE 8 items completi e reali. MAI lasciare items vuoti o generici.

Se tipo è 'trasformazione':
{
  "type": "trasformazione",
  "items": [
    { "id": 1, "original_sentence": "frase originale", "instruction": "istruzione di trasformazione", "correct_answer": "risposta corretta" }
  ]
}
DEVI generare ESATTAMENTE 6 items completi.

Se tipo è 'riscrittura':
{
  "type": "riscrittura",
  "original_text": "testo con errori reali",
  "instruction": "istruzione di riscrittura"
}

Se tipo è 'scrittura':
{
  "type": "scrittura",
  "prompt": "consegna specifica",
  "min_words": 80,
  "max_words": 120
}

REGOLA ASSOLUTA: exercise_content non può MAI essere vuoto, generico o solo testo descrittivo. Deve sempre contenere il contenuto completo e pronto per essere risolto dallo studente.

Rispondi UNICAMENTE con un oggetto JSON valido senza markdown, esattamente con questa struttura:
{
  "title": "Titolo accattivante in italiano",
  "theory_explanation": "Spiegazione teorica in formato markdown (usa il grassetto per gli esempi)",
  "exercise_instructions": "Istruzioni passo dopo passo per lo studente",
  "exercise_content": { ... },
  "error_focus": "Breve descrizione dell'errore principale su cui si focalizza il compito"
}`

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
      console.error("Gemini Task Generation API Error Detail:", geminiData);
      const errorMsg = geminiData.error?.message || `AI Service Error (${geminiResponse.status})`;
      throw new Error(errorMsg);
    }
    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || ""
    const geminiResult = await validateAiResponse(rawText, taskGenerationSchema)

    if (!geminiResult) {
      return NextResponse.json({ error: "L'IA ha restituito un formato non valido" }, { status: 500 })
    }

    return NextResponse.json(geminiResult)

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
