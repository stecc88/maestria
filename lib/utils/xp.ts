export function calculateXpForCorrection(score: number): number {
  // Simple logic: base XP + score multiplier
  return 50 + (score * 2);
}

export function calculateXpForTask(score: number): number {
  return 25 + score;
}
