import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"
import { getCorrectionFromGemini } from "@/lib/gemini/correction"
import { calculateXpForCorrection } from "@/lib/utils/xp"

export async function POST(request: Request) {
  const supabase = createClient()
  const adminSupabase = createAdminClient()

  // 1. Check Auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const { textType, level, prompt, content } = await request.json()

    if (!content || content.length < 10) {
      return NextResponse.json({ error: "Texto demasiado corto" }, { status: 400 })
    }

    // 2. Get Correction from Gemini
    const result = await getCorrectionFromGemini(content, level, textType, prompt)
    console.log("Gemini result received:", JSON.stringify(result, null, 2))

    // 3. Save to DB (Writing + Correction + Student Update + History)
    // We use a manual transaction-like approach since Supabase JS doesn't support
    // multi-table transactions natively without RPC.

    // a. Save Writing (Using admin client for consistency in writes)
    const { data: writing, error: writingError } = await adminSupabase
      .from("writings")
      .insert({
        student_id: user.id,
        title: prompt ? (prompt.substring(0, 50) + "...") : (textType.replace('_', ' ').toUpperCase()),
        content,
        writing_type: textType,
        target_level: level,
        word_count: content.trim().split(/\s+/).length
      })
      .select()
      .single()

    if (writingError) {
      console.error("Writing save error:", writingError)
      throw writingError
    }

    // b. Save Correction
    const allowedLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
    const detectedLevel = allowedLevels.includes(result.detected_level) ? result.detected_level : level

    const sanitizeScore = (score: any, max: number) => {
      const num = parseInt(score)
      if (isNaN(num)) return 0
      return Math.min(Math.max(num, 0), max)
    }

    const sanitizedOverallScore = sanitizeScore(result.overall_score, 100)
    const xpEarned = calculateXpForCorrection(sanitizedOverallScore)

    const { data: correction, error: correctionError } = await adminSupabase
      .from("corrections")
      .insert({
        writing_id: writing.id,
        detected_level: detectedLevel,
        overall_score: sanitizedOverallScore,
        exam_compliant: !!result.exam_compliant,
        score_coherence: sanitizeScore(result.score_coherence, 25),
        score_vocabulary: sanitizeScore(result.score_vocabulary, 25),
        score_grammar: sanitizeScore(result.score_grammar, 25),
        score_task_completion: sanitizeScore(result.score_task_completion, 25),
        pros: result.pros || [],
        cons: result.cons || [],
        suggestions: result.suggestions || [],
        corrected_text: result.corrected_text || content,
        examiner_comment: result.examiner_comment || "Sin comentarios",
        inline_corrections: result.inline_corrections || [],
        error_categories: result.error_categories || {},
        next_steps: result.next_steps || [],
        meets_level_requirements: result.meets_level_requirements || {},
        xp_earned: xpEarned
      })
      .select()
      .single()

    if (correctionError) {
      console.error("Correction save error:", correctionError)
      throw correctionError
    }

    // c. Update Student XP and current_level
    const { data: student } = await adminSupabase
      .from("students")
      .select("xp_points")
      .eq("id", user.id)
      .single()

    const newXp = (student?.xp_points || 0) + xpEarned

    const { error: studentError } = await adminSupabase
      .from("students")
      .update({
        xp_points: newXp,
        current_level: result.detected_level,
        last_activity: new Date().toISOString()
      })
      .eq("id", user.id)

    if (studentError) throw studentError

    // d. Save to Progress History
    await adminSupabase.from("progress_history").insert({
      student_id: user.id,
      writing_score: sanitizedOverallScore,
      detected_level: detectedLevel,
      xp_earned: xpEarned
    })

    return NextResponse.json({ id: correction.id })

  } catch (error: any) {
    console.error("API /api/correct error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
