import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { safeParseJson } from "@/lib/gemini/client"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      content,
      writing_type,
      textType,
      target_level,
      level,
      consigna,
      prompt: clientPrompt
    } = body

    const finalContent = content
    const finalWritingType = writing_type || textType || "libre"
    const finalTargetLevel = target_level || level || "B1"
    const finalConsigna = consigna || clientPrompt || "No especificada"

    if (!finalContent || finalContent.trim().length < 10) {
      return Response.json({ error: "El texto es demasiado corto" }, { status: 400 })
    }

    const prompt = `Eres un examinador experto de italiano como lengua extranjera con 20 años de experiencia, equivalente a los estándares de certificación internacional más exigentes.

Evaluá el siguiente texto escrito por un estudiante.

NIVEL OBJETIVO: ${finalTargetLevel}
TIPO DE TEXTO: ${finalWritingType}
CONSIGNA: ${finalConsigna}

TEXTO DEL ALUMNO:
${content}

Respondé ÚNICAMENTE con JSON válido sin markdown, sin texto adicional, exactamente con esta estructura:
{
  "detected_level": "B1",
  "overall_score": 72,
  "exam_compliant": true,
  "score_coherence": 18,
  "score_vocabulary": 17,
  "score_grammar": 16,
  "score_task_completion": 21,
  "examiner_comment": "Comentario profesional de 150-200 palabras en español",
  "pros": ["Fortaleza 1 con ejemplo del texto", "Fortaleza 2", "Fortaleza 3"],
  "cons": ["Debilidad 1 con ejemplo", "Debilidad 2", "Debilidad 3"],
  "suggestions": [
    {"category": "Gramática", "tip": "Sugerencia específica", "example": "Ejemplo"},
    {"category": "Vocabulario", "tip": "Sugerencia", "example": "Ejemplo"},
    {"category": "Estructura", "tip": "Sugerencia", "example": "Ejemplo"}
  ],
  "corrected_text": "Versión corregida completa del texto",
  "inline_corrections": [
    {"original": "frase con error", "corrected": "frase corregida", "explanation": "explicación", "error_type": "gramatica"}
  ],
  "error_categories": {
    "gramatica": "descripción del error gramatical principal",
    "vocabulario": "descripción del error de vocabulario principal",
    "ortografia": "descripción del error ortográfico principal",
    "registro": "problemas de registro si existe",
    "estructura": "problemas de estructura si existe"
  },
  "next_steps": ["Paso 1 concreto", "Paso 2 concreto", "Paso 3 concreto"],
  "meets_level_requirements": {"A1": true, "A2": true, "B1": true, "B2": false, "C1": false, "C2": false}
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
    const correction = safeParseJson(rawText)

    if (!correction) {
      return Response.json({ error: "La IA devolvió un formato inválido" }, { status: 500 })
    }

    // Obtener el usuario autenticado
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: "No autorizado" }, { status: 401 })

    const adminSupabase = createAdminClient()

    // Guardar el escrito
    const wordCount = finalContent.trim().split(/\s+/).length
    const { data: writing, error: writingError } = await adminSupabase
      .from("writings")
      .insert({
        student_id: user.id,
        content: finalContent,
        writing_type: finalWritingType,
        target_level: finalTargetLevel,
        word_count: wordCount,
        title: `${finalWritingType} - ${new Date().toLocaleDateString("es-AR")}`
      })
      .select()
      .single()

    if (writingError) {
      console.error("Error guardando writing:", writingError)
      return Response.json({ error: "Error guardando el escrito" }, { status: 500 })
    }

    // Calcular XP
    const xpEarned = 50 + Math.floor(correction.overall_score / 2)

    // Guardar la corrección
    const { data: savedCorrection, error: correctionError } = await adminSupabase
      .from("corrections")
      .insert({
        writing_id: writing.id,
        detected_level: correction.detected_level,
        overall_score: correction.overall_score,
        exam_compliant: correction.exam_compliant,
        score_coherence: correction.score_coherence,
        score_vocabulary: correction.score_vocabulary,
        score_grammar: correction.score_grammar,
        score_task_completion: correction.score_task_completion,
        pros: correction.pros,
        cons: correction.cons,
        suggestions: correction.suggestions,
        corrected_text: correction.corrected_text,
        examiner_comment: correction.examiner_comment,
        inline_corrections: correction.inline_corrections,
        error_categories: correction.error_categories,
        next_steps: correction.next_steps,
        meets_level_requirements: correction.meets_level_requirements,
        xp_earned: xpEarned
      })
      .select()
      .single()

    if (correctionError) {
      console.error("Error guardando correction:", correctionError)
      return Response.json({ error: "Error guardando la corrección" }, { status: 500 })
    }

    // Actualizar XP del alumno
    await adminSupabase
      .from("students")
      .update({
        current_level: correction.detected_level,
        last_activity: new Date().toISOString()
      })
      .eq("id", user.id)

    // Sumar XP con raw SQL
    const { error: rpcError } = await adminSupabase.rpc("increment_xp", {
      student_id: user.id,
      xp_amount: xpEarned
    })

    if (rpcError) {
      console.error("Error calling increment_xp RPC:", rpcError)
    }

    // Guardar en progress_history
    await adminSupabase.from("progress_history").insert({
      student_id: user.id,
      writing_score: correction.overall_score,
      detected_level: correction.detected_level,
      xp_earned: xpEarned
    })

    return Response.json({
      success: true,
      correctionId: savedCorrection.id,
      xpEarned
    })

  } catch (error: any) {
    console.error("Error en /api/correct:", error)
    return Response.json({ error: error.message || "Error interno" }, { status: 500 })
  }
}
