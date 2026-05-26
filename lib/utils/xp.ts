/**
 * Calculation logic for XP points in Maestria
 */

export function calculateXpForCorrection(score: number, isFirstOfDay: boolean = false): number {
  const base = 50
  const bonus = Math.floor(score / 2)
  const dailyBonus = isFirstOfDay ? 25 : 0

  return base + bonus + dailyBonus
}

export function calculateXpForTask(score: number): number {
  const base = 75
  const bonus = Math.floor(score / 4)

  return base + bonus
}

export function calculateStreakBonus(streakDays: number): number {
  if (streakDays % 7 === 0 && streakDays > 0) {
    return 100
  }
  return 0
}
