import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { validateAiResponse } from "@/lib/gemini/client"
import { correctionSchema } from "@/lib/validations/ai"
import { calculateXpForCorrection } from "@/lib/utils/xp"

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
    const finalWritingType = writing_type || textType || "libero"
    const finalTargetLevel = target_level || level || "B1"
    const finalConsigna = consigna || clientPrompt || "Non specificata"

    if (!finalContent || finalContent.trim().length < 10) {
      return Response.json({ error: "Il testo è troppo breve" }, { status: 400 })
    }

    const prompt = `IMPORTANTE: Rispondi SEMPRE e SOLO in italiano. Mai in spagnolo o altre lingue.

Sei un esaminatore esperto di italiano come lingua straniera con 20 anni di esperienza, equivalente ai più esigenti standard di certificazione internazionale (CILS, CELI, PLIDA).

Valuta il seguente testo scritto da uno studente.

LIVELLO OBIETTIVO: ${finalTargetLevel}
TIPO DI TESTO: ${finalWritingType}
CONSEGNA: ${finalConsigna}

TESTO DELLO STUDENTE:
${content}

Rispondi UNICAMENTE con JSON valido senza markdown, senza testo aggiuntivo, esattamente con questa struttura:
{
  "detected_level": "B1",
  "overall_score": 72,
  "exam_compliant": true,
  "score_coherence": 18,
  "score_vocabulary": 17,
  "score_grammar": 16,
  "score_task_completion": 21,
  "examiner_comment": "Commento professionale di 150-200 parole IN ITALIANO",
  "pros": ["Punto di forza 1 con esempio dal testo IN ITALIANO", "Punto di forza 2 IN ITALIANO", "Punto di forza 3 IN ITALIANO"],
  "cons": ["Punto di debolezza 1 con esempio IN ITALIANO", "Punto di debolezza 2 IN ITALIANO", "Punto di debolezza 3 IN ITALIANO"],
  "suggestions": [
    {"category": "Grammatica", "tip": "Suggerimento specifico IN ITALIANO", "example": "Esempio IN ITALIANO"},
    {"category": "Lessico", "tip": "Suggerimento IN ITALIANO", "example": "Esempio IN ITALIANO"},
    {"category": "Struttura", "tip": "Suggerimento IN ITALIANO", "example": "Esempio IN ITALIANO"}
  ],
  "corrected_text": "Versione corretta completa del testo",
  "inline_corrections": [
    {"original": "frase con error", "corrected": "frase corretta", "explanation": "spiegazione IN ITALIANO", "error_type": "grammatica"}
  ],
  "error_categories": {
    "grammatica": "descrizione dell'errore grammaticale principale IN ITALIANO",
    "lessico": "descrizione dell'errore di lessico principale IN ITALIANO",
    "ortografia": "descrizione dell'errore ortografico principale IN ITALIANO",
    "registro": "problemi di registro se presenti IN ITALIANO",
    "struttura": "problemi di struttura se presenti IN ITALIANO"
  },
  "next_steps": ["Passo 1 concreto IN ITALIANO", "Passo 2 concreto IN ITALIANO", "Passo 3 concreto IN ITALIANO"],
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
    const correction = await validateAiResponse(rawText, correctionSchema)

    if (!correction) {
      return Response.json({ error: "L'IA ha restituito un formato non valido o incompleto" }, { status: 500 })
    }

    // Obtener el usuario autenticado
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: "Non autorizzato" }, { status: 401 })

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
        title: `${finalWritingType} - ${new Date().toLocaleDateString("it-IT")}`
      })
      .select()
      .single()

    if (writingError) {
      return Response.json({ error: "Errore durante il salvataggio dello scritto" }, { status: 500 })
    }

    // Calcular XP
    const xpEarned = calculateXpForCorrection(correction.overall_score)

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
      return Response.json({ error: "Errore durante il salvataggio della correzione" }, { status: 500 })
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
    return Response.json({ error: error.message || "Errore interno" }, { status: 500 })
  }
}
