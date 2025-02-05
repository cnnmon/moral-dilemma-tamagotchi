import { Dilemma, dilemmas } from '../../constants/dilemmas';

// get a random dilemma that hasn't been seen by this pet
export function getUnseenDilemma(seenDilemmaIds: string[]): Dilemma | null {
  const allDilemmas = Object.values(dilemmas).flat();
  const unseenDilemmas = allDilemmas.filter(
    dilemma => !seenDilemmaIds.includes(dilemma.id)
  );

  if (unseenDilemmas.length === 0) {
    return null;
  }

  return unseenDilemmas[Math.floor(Math.random() * unseenDilemmas.length)];
}
