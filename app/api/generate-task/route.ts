import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { safeParseJson } from "@/lib/gemini/client"

export async function POST(request: Request) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
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

    const prompt = `Eres un experto en didáctica del italiano para extranjeros con amplia experiencia.
El alumno tiene un nivel detectado de: ${studentLevel}.
Cometió este error frecuentemente: ${errorType} — específicamente: ${errorDetail}.
Notas adicionales del profesor: ${additionalNotes || 'Ninguna'}.

Crea:
1. Una explicación teórica clara y pedagógica de la regla gramatical o de uso relacionada (en español, con ejemplos en italiano resaltados).
2. Un ejercicio de tipo "${exerciseType}" apropiado para el nivel ${studentLevel}.
El ejercicio debe estar directamente relacionado con ese error específico para que el alumno pueda practicarlo.

Responde ÚNICAMENTE con un objeto JSON (sin markdown) con esta estructura:
{
  "title": "Título atractivo para la tarea",
  "theory_explanation": "Explicación detallada en formato markdown (usa negritas para ejemplos en italiano)",
  "exercise_instructions": "Instrucciones paso a paso para el alumno",
  "exercise_content": "Objeto o string con el contenido del ejercicio según el tipo (ej: texto con [___] para completar, o lista de oraciones)"
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
      return NextResponse.json({ error: "La IA devolvió un formato inválido" }, { status: 500 })
    }

    return NextResponse.json(geminiResult)

  } catch (error: any) {
    console.error("Error generating task:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
