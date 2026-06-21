import { createAdminClient } from "@/lib/supabase/admin"

const CEFR_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

export interface AchievementStats {
  writingsCount: number
  streakDays: number
  bestScore: number
  firstLevel: string | null
  currentLevel: string | null
  targetLevel: string | null
  tasksCompletedCount: number
  globalRank: number | null
}

/**
 * Calcula qué logros corresponden según datos reales del alumno.
 * Cada criterio está atado a una métrica verificable, sin valores inventados.
 */
export function computeUnlockedAchievements(stats: AchievementStats): string[] {
  const unlocked: string[] = []

  if (stats.writingsCount >= 1) unlocked.push('first_step')
  if (stats.streakDays >= 7) unlocked.push('on_fire')
  if (stats.writingsCount >= 10) unlocked.push('studious')
  if (stats.writingsCount >= 25) unlocked.push('perseverant')
  if (stats.bestScore >= 90) unlocked.push('excellence')

  if (stats.firstLevel && stats.currentLevel) {
    const startIdx = CEFR_ORDER.indexOf(stats.firstLevel)
    const currentIdx = CEFR_ORDER.indexOf(stats.currentLevel)
    if (startIdx !== -1 && currentIdx !== -1 && currentIdx - startIdx >= 2) {
      unlocked.push('ascending')
    }
  }

  if (stats.globalRank != null && stats.globalRank <= 3) unlocked.push('podium')
  if (stats.globalRank === 1) unlocked.push('champion')
  if (stats.tasksCompletedCount >= 10) unlocked.push('applied')

  if (stats.currentLevel && stats.targetLevel && stats.currentLevel === stats.targetLevel) {
    unlocked.push('master')
  }

  return unlocked
}

/**
 * Recalcula los logros de un alumno a partir de sus datos reales en Supabase
 * y persiste el resultado (unión con los ya desbloqueados, nunca se quitan).
 * Devuelve los IDs recién desbloqueados en esta llamada (para notificar si se quiere).
 */
export async function refreshStudentAchievements(studentId: string): Promise<string[]> {
  const adminSupabase = createAdminClient()

  const { data: student } = await adminSupabase
    .from("students")
    .select("xp_points, streak_days, current_level, target_level, achievements")
    .eq("id", studentId)
    .single()

  if (!student) return []

  const [writingsResult, tasksResult, progressResult, allStudentsResult] = await Promise.all([
    adminSupabase
      .from("writings")
      .select("id, corrections(overall_score)")
      .eq("student_id", studentId),
    adminSupabase
      .from("tasks")
      .select("id", { count: "exact", head: true })
      .eq("student_id", studentId)
      .eq("status", "completed"),
    adminSupabase
      .from("progress_history")
      .select("detected_level, created_at")
      .eq("student_id", studentId)
      .order("created_at", { ascending: true })
      .limit(1),
    adminSupabase
      .from("students")
      .select("id, xp_points")
      .order("xp_points", { ascending: false }),
  ])

  const writings = writingsResult.data || []
  const writingsCount = writings.length
  const bestScore = writings.reduce((max: number, w: any) => {
    const correction = Array.isArray(w.corrections) ? w.corrections[0] : w.corrections
    const score = correction?.overall_score ?? 0
    return score > max ? score : max
  }, 0)

  const tasksCompletedCount = tasksResult.count || 0
  const firstLevel = progressResult.data?.[0]?.detected_level || null

  const allStudents = allStudentsResult.data || []
  const rankIndex = allStudents.findIndex((s: any) => s.id === studentId)
  const globalRank = rankIndex >= 0 ? rankIndex + 1 : null

  const newlyComputed = computeUnlockedAchievements({
    writingsCount,
    streakDays: student.streak_days || 0,
    bestScore,
    firstLevel,
    currentLevel: student.current_level,
    targetLevel: student.target_level,
    tasksCompletedCount,
    globalRank,
  })

  const existing: string[] = student.achievements || []
  const merged = Array.from(new Set([...existing, ...newlyComputed]))
  const newlyUnlocked = merged.filter((id) => !existing.includes(id))

  if (newlyUnlocked.length > 0) {
    await adminSupabase
      .from("students")
      .update({ achievements: merged })
      .eq("id", studentId)
  }

  return newlyUnlocked
}
