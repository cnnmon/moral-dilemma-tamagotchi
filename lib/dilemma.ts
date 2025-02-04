import { DilemmaResponse } from '../constants/dilemmas';
import { MoralDimensionsType } from '../constants/morals';
import { openai, dilemmaSystemPrompt } from './openai';

interface ProcessDilemmaParams {
  petName: string;
  dilemmaText: string;
  response: string;
  personality: string;
  moralStats: MoralDimensionsType;
  sanity: number;
}

// process a dilemma response using openai
export async function processDilemmaResponse({
  petName,
  dilemmaText,
  response,
  personality,
  moralStats,
  sanity,
}: ProcessDilemmaParams): Promise<DilemmaResponse> {
  try {
    // format the prompt with pet's details
    const formattedPrompt = dilemmaSystemPrompt
      .replace(/{pet}/g, petName)
      .replace('{dilemma}', dilemmaText)
      .replace('{response}', response)
      .replace('{personality}', personality)
      .replace('{morals}', JSON.stringify(moralStats, null, 2))
      .replace('{sanity}', sanity.toString());

    // call openai api
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
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

    // parse and validate the json response
    const parsedResponse = JSON.parse(result) as DilemmaResponse;
    
    // ensure the response matches our expected format
    if (typeof parsedResponse.ok !== 'boolean') {
      throw new Error('invalid response format');
    }

    return parsedResponse;
  } catch (error) {
    console.error('error processing dilemma:', error);
    // return a fallback response asking for clarification
    return {
      ok: false,
      question: 'hmm... something went wrong. could you try explaining that again?',
    };
  }
} 