import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { getGeminiClient, safeParseJson } from "@/lib/gemini/client"

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

    const ai = getGeminiClient()
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash-lite" })
    const result = await model.generateContent(prompt)
    const rawText = result.response.text()
    const geminiResponse = safeParseJson(rawText)

    if (!geminiResponse) {
      return NextResponse.json({ error: "La IA devolvió un formato inválido" }, { status: 500 })
    }

    return NextResponse.json(geminiResponse)

  } catch (error: any) {
    console.error("Error generating task:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
