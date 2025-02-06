import { DilemmaTemplate, dilemmaTemplates } from '../../constants/dilemmas';

// get a random dilemma that hasn't been seen yet
export function getUnseenDilemma(seenDilemmaIds: string[]): DilemmaTemplate | null {
  // get all dilemma ids
  const allDilemmaIds = Object.keys(dilemmaTemplates);
  
  // filter out seen dilemmas
  const unseenDilemmaIds = allDilemmaIds.filter(id => !seenDilemmaIds.includes(id));
  
  // if no unseen dilemmas, return null
  if (unseenDilemmaIds.length === 0) {
    return null;
  }
  
  // get random unseen dilemma
  const randomIndex = Math.floor(Math.random() * unseenDilemmaIds.length);
  const randomDilemmaId = unseenDilemmaIds[randomIndex];
  
  return dilemmaTemplates[randomDilemmaId];
}
