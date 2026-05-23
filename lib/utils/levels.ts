export const ITALIAN_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;
export type ItalianLevel = typeof ITALIAN_LEVELS[number];

export function getNextLevel(currentLevel: ItalianLevel): ItalianLevel | null {
  const index = ITALIAN_LEVELS.indexOf(currentLevel);
  if (index >= 0 && index < ITALIAN_LEVELS.length - 1) {
    return ITALIAN_LEVELS[index + 1];
  }
  return null;
}
