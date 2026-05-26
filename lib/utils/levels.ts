/**
 * Platform gamified levels logic (distinct from Italian CEFR levels)
 */

export const GAMIFIED_LEVELS = [
  { name: 'Novizio', minXp: 0, color: '#94a3b8', badge: '⚪' },
  { name: 'Apprendista', minXp: 300, color: '#22c55e', badge: '🟢' },
  { name: 'Studente', minXp: 800, color: '#3b82f6', badge: '🔵' },
  { name: 'Praticante', minXp: 1800, color: '#f97316', badge: '🟠' },
  { name: 'Esperto', minXp: 3500, color: '#a855f7', badge: '🟣' },
  { name: 'Maestro', minXp: 7000, color: '#eab308', badge: '🟡' },
]

export function getLevelFromXP(xp: number) {
  let currentLevel = GAMIFIED_LEVELS[0]
  let nextLevel = GAMIFIED_LEVELS[1]

  for (let i = GAMIFIED_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= GAMIFIED_LEVELS[i].minXp) {
      currentLevel = GAMIFIED_LEVELS[i]
      nextLevel = GAMIFIED_LEVELS[i + 1] || null
      break
    }
  }

  return {
    current: currentLevel,
    next: nextLevel,
    progress: nextLevel ? ((xp - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp)) * 100 : 100
  }
}

// Italian CEFR Levels (for reference)
export const ITALIAN_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;
export type ItalianLevel = typeof ITALIAN_LEVELS[number];

export function getNextLevel(currentLevel: ItalianLevel): ItalianLevel | null {
  const index = ITALIAN_LEVELS.indexOf(currentLevel);
  if (index >= 0 && index < ITALIAN_LEVELS.length - 1) {
    return ITALIAN_LEVELS[index + 1];
  }
  return null;
}
