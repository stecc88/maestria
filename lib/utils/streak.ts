/**
 * Calcula la nueva racha de días consecutivos del alumno, comparando
 * la fecha de su última actividad real contra hoy.
 *
 * - Si ya tuvo actividad hoy: la racha no cambia (evita contar 2 veces el mismo día).
 * - Si su última actividad fue ayer: la racha sigue (+1).
 * - Si pasó más de un día sin actividad: la racha se reinicia a 1.
 * - Si nunca tuvo actividad: arranca en 1.
 */
export function calculateNewStreak(lastActivity: string | null, currentStreak: number): number {
  if (!lastActivity) return 1

  const last = new Date(lastActivity)
  const now = new Date()

  const toDateOnly = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())

  const lastDay = toDateOnly(last)
  const today = toDateOnly(now)

  const diffDays = Math.round((today.getTime() - lastDay.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return currentStreak || 1
  if (diffDays === 1) return (currentStreak || 0) + 1
  return 1
}
