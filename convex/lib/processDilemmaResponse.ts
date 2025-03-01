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

// get prompt based on pet's stage with improved template handling
function getPrompt(pet: Doc<"pets">, dilemma: DilemmaTemplate, selectedChoice: string, responseText: string) {
  const age = pet.age;
  let prompt: string | undefined;

  if (age === 0) {
    prompt = babyPrompt; 
  } else if (age === 1) {
    if (!pet.evolutionId) {
      throw new Error('evolutionId is required for stage 2');
    }
    prompt = stage1Prompt;
  } else if (age === 2) {
    if (!pet.evolutionId) {
      throw new Error('evolutionId is required for stage 3');
    }
    prompt = stage2Prompt;
  } else {
    throw new Error('invalid stage');
  }

  const evolution = getEvolution(pet.evolutionId as EvolutionId);
  
  // more efficient replacement with a single pass
  const replacements = {
    '{dilemma}': dilemma.text,
    '{choice}': selectedChoice,
    '{response}': responseText,
    '{personality}': pet.personality,
    '{morals.compassion}': (Math.round(pet.moralStats.compassion * 100) / 100).toString(),
    '{morals.retribution}': (Math.round(pet.moralStats.retribution * 100) / 100).toString(),
    '{morals.devotion}': (Math.round(pet.moralStats.devotion * 100) / 100).toString(),
    '{morals.dominance}': (Math.round(pet.moralStats.dominance * 100) / 100).toString(),
    '{morals.purity}': (Math.round(pet.moralStats.purity * 100) / 100).toString(),
    '{morals.ego}': (Math.round(pet.moralStats.ego * 100) / 100).toString(),
    '{evolution.description}': evolution.description,
    '{pet}': pet.name,
    '{evolution.stage}': pet.evolutionId || ''
  };
  
  let formattedPrompt = prompt;
  for (const [key, value] of Object.entries(replacements)) {
    formattedPrompt = formattedPrompt.replace(new RegExp(key, 'g'), value);
  }

  return formattedPrompt;
}

// process a dilemma response using openai with improved error handling
export default async function processDilemmaResponse({
  pet,
  dilemma,
  selectedChoice,
  responseText,
}: ProcessDilemmaParams): Promise<unknown> {
  const formattedPrompt = getPrompt(pet, dilemma, selectedChoice, responseText);
  console.log('🤖 formatted prompt:', formattedPrompt);

  try {
    // call openai api with system message
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
  } catch (error) {
    console.error('error calling openai:', error);
    throw new Error('failed to process dilemma response');
  }
} 
