import { DilemmaTemplate } from '../../constants/dilemmas';
import { MoralDimensionsType } from '../../constants/morals';
import { openai, eggPrompt, stage1Prompt, stage2Prompt } from './prompt';

interface ProcessDilemmaParams {
  pet: Pet;
  dilemma: DilemmaTemplate;
  responseText: string;
  clarifyingQuestion?: string;
}

interface Pet {
  name: string;
  personality: string;
  age: number;
  evolutionId?: string;
  moralStats: MoralDimensionsType;
}

// get prompt based on pet's stage
// trust in caretaker decreases as pet's stage increases
function getPrompt(pet: Pet, dilemma: DilemmaTemplate, responseText: string, clarifyingQuestion: string | undefined) {
  const stage = pet.age;
  let prompt: string | undefined;

  if (stage === 1) {
    prompt = eggPrompt; 
  } else if (stage === 2) {
    if (!pet.evolutionId) {
      throw new Error('evolutionId is required for stage 2');
    }
    prompt = stage1Prompt.replace('{evolution.stage}', pet.evolutionId);
  } else if (stage === 3) {
    if (!pet.evolutionId) {
      throw new Error('evolutionId is required for stage 3');
    }
    prompt = stage2Prompt.replace('{evolution.stage}', pet.evolutionId);
  } else {
    throw new Error('invalid stage');
  }

  const clarifyingQuestionText = clarifyingQuestion ? `${pet.name}'s clarifying question: "${clarifyingQuestion}"` : '';
  const formattedPrompt = prompt
    .replace('{dilemma}', dilemma.text)
    .replace('{dilemma.moralDimensions}', dilemma.relatedStats.join(', '))
    .replace('{clarifyingQuestion}', clarifyingQuestionText)
    .replace('{response}', responseText)
    .replace('{personality}', pet.personality)
    .replace('{morals.compassion}', pet.moralStats.compassion.toString())
    .replace('{morals.retribution}', pet.moralStats.retribution.toString())
    .replace('{morals.devotion}', pet.moralStats.devotion.toString())
    .replace('{morals.dominance}', pet.moralStats.dominance.toString())
    .replace('{morals.purity}', pet.moralStats.purity.toString())
    .replace('{morals.ego}', pet.moralStats.ego.toString())
    .replace(/{pet}/g, pet.name);

  return formattedPrompt;
}

// process a dilemma response using openai
export default async function processDilemmaResponse({
  pet,
  dilemma,
  responseText,
  clarifyingQuestion,
}: ProcessDilemmaParams): Promise<unknown> {
  const formattedPrompt = getPrompt(pet, dilemma, responseText, clarifyingQuestion);
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
