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

    // 3. Save to DB (Writing + Correction + Student Update + History)
    // We use a manual transaction-like approach since Supabase JS doesn't support
    // multi-table transactions natively without RPC.

    // a. Save Writing
    const { data: writing, error: writingError } = await supabase
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

    if (writingError) throw writingError

    // b. Save Correction
    const xpEarned = calculateXpForCorrection(result.overall_score || 0)

    const { data: correction, error: correctionError } = await adminSupabase
      .from("corrections")
      .insert({
        writing_id: writing.id,
        detected_level: result.detected_level,
        overall_score: result.overall_score,
        exam_compliant: result.exam_compliant,
        score_coherence: result.score_coherence,
        score_vocabulary: result.score_vocabulary,
        score_grammar: result.score_grammar,
        score_task_completion: result.score_task_completion,
        pros: result.pros,
        cons: result.cons,
        suggestions: result.suggestions,
        corrected_text: result.corrected_text,
        examiner_comment: result.examiner_comment,
        inline_corrections: result.inline_corrections,
        error_categories: result.error_categories,
        next_steps: result.next_steps,
        meets_level_requirements: result.meets_level_requirements,
        xp_earned: xpEarned
      })
      .select()
      .single()

    if (correctionError) throw correctionError

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
      writing_score: result.overall_score,
      detected_level: result.detected_level,
      xp_earned: xpEarned
    })

    return NextResponse.json({ id: correction.id })

  } catch (error: any) {
    console.error("API /api/correct error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
