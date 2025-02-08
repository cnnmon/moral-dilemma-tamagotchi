import { DilemmaTemplate, dilemmaTemplates } from '../../constants/dilemmas';

// get all dilemmas that haven't been seen yet
export function getUnseenDilemmas(seenDilemmaTitles: string[]): DilemmaTemplate[] {
  // get all dilemma ids
  const allDilemmaIds = Object.keys(dilemmaTemplates);
  
  // filter out seen dilemmas
  const unseenDilemmaIds = allDilemmaIds.filter(id => !seenDilemmaTitles.includes(id));
  
  // return all unseen dilemmas
  return unseenDilemmaIds.map(id => dilemmaTemplates[id]);
}