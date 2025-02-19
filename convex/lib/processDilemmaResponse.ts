import { DilemmaTemplate } from '../../constants/dilemmas';
import { openai, babyPrompt, stage1Prompt, stage2Prompt } from './prompt';
import { EvolutionId, getEvolution } from '../../constants/evolutions';
import { Doc } from '../_generated/dataModel';

interface ProcessDilemmaParams {
  pet: Doc<"pets">;
  dilemma: DilemmaTemplate;
  selectedChoice: string;
  responseText: string;
}

// get prompt based on pet's stage
// trust in caretaker decreases as pet's stage increases
function getPrompt(pet: Doc<"pets">, dilemma: DilemmaTemplate, selectedChoice: string, responseText: string) {
  const age = pet.age;
  let prompt: string | undefined;

  if (age === 0) {
    prompt = babyPrompt; 
  } else if (age === 1) {
    if (!pet.evolutionId) {
      throw new Error('evolutionId is required for stage 2');
    }
    prompt = stage1Prompt.replace('{evolution.stage}', pet.evolutionId);
  } else if (age === 2) {
    if (!pet.evolutionId) {
      throw new Error('evolutionId is required for stage 3');
    }
    prompt = stage2Prompt.replace('{evolution.stage}', pet.evolutionId);
  } else {
    throw new Error('invalid stage');
  }

  const evolution = getEvolution(pet.evolutionId as EvolutionId);
  const formattedPrompt = prompt
    .replace('{dilemma}', dilemma.text)
    .replace('{choice}', selectedChoice)
    .replace('{reason}', responseText)
    .replace('{personality}', pet.personality)
    .replace('{morals.compassion}', pet.moralStats.compassion.toString())
    .replace('{morals.retribution}', pet.moralStats.retribution.toString())
    .replace('{morals.devotion}', pet.moralStats.devotion.toString())
    .replace('{morals.dominance}', pet.moralStats.dominance.toString())
    .replace('{morals.purity}', pet.moralStats.purity.toString())
    .replace('{morals.ego}', pet.moralStats.ego.toString())
    .replace('{evolution.description}', evolution.description)
    .replace(/{pet}/g, pet.name);

  return formattedPrompt;
}

// process a dilemma response using openai
export default async function processDilemmaResponse({
  pet,
  dilemma,
  selectedChoice,
  responseText,
}: ProcessDilemmaParams): Promise<unknown> {
  const formattedPrompt = getPrompt(pet, dilemma, selectedChoice, responseText);
  console.log('🤖 Formatted prompt:', formattedPrompt);

  // call openai api
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini-2024-07-18',
    messages: [
      {
        role: 'system',
        content: formattedPrompt,
      },
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' },
  });

  // parse the response
  const result = completion.choices[0]?.message?.content;
  if (!result) {
    throw new Error('no response from openai');
  }

  return result;
} 
