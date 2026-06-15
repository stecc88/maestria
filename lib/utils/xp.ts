/**
 * Calculation logic for XP points in Maestria
 */

export const XP_CONFIG = {
  WRITING_BASE: 50,
  WRITING_SCORE_MULTIPLIER: 0.5,
  TASK_BASE: 75,
  TASK_SCORE_MULTIPLIER: 0.25,
  DAILY_FIRST_BONUS: 25,
  WEEKLY_STREAK_BONUS: 100,
}

/**
 * Calculates XP earned for a writing correction.
 */
export function calculateXpForCorrection(score: number, isFirstOfDay: boolean = false): number {
  const base = XP_CONFIG.WRITING_BASE
  const bonus = Math.floor(score * XP_CONFIG.WRITING_SCORE_MULTIPLIER)
  const dailyBonus = isFirstOfDay ? XP_CONFIG.DAILY_FIRST_BONUS : 0

  return base + bonus + dailyBonus
}

/**
 * Calculates XP earned for completing a task exercise.
 */
export function calculateXpForTask(score: number): number {
  const base = XP_CONFIG.TASK_BASE
  const bonus = Math.floor(score * XP_CONFIG.TASK_SCORE_MULTIPLIER)

  return base + bonus
}

/**
 * Calculates periodic streak bonuses.
 */
export function calculateStreakBonus(streakDays: number): number {
  if (streakDays > 0 && streakDays % 7 === 0) {
    return XP_CONFIG.WEEKLY_STREAK_BONUS
  }
  return 0
}
