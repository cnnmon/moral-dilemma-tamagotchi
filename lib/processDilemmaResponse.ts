import { MoralDimensionsType } from '../constants/morals';
import { openai, dilemmaSystemPrompt } from './prompt';

interface ProcessDilemmaParams {
  pet: Pet;
  dilemmaText: string;
  responseText: string;
}

interface Pet {
  name: string;
  personality: string;
  moralStats: MoralDimensionsType;
}

// process a dilemma response using openai
export default async function processDilemmaResponse({
  pet,
  dilemmaText,
  responseText,
}: ProcessDilemmaParams): Promise<unknown> {
  const formattedPrompt = dilemmaSystemPrompt
    .replace(/{pet}/g, pet.name)
    .replace('{dilemma}', dilemmaText)
    .replace('{response}', responseText)
    .replace('{personality}', pet.personality)
    .replace('{morals}', JSON.stringify(pet.moralStats, null, 2))

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
