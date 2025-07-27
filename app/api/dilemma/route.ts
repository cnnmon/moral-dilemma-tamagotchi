import { NextRequest } from "next/server";
import OpenAI from 'openai';
import { dilemmaTemplates, DilemmaTemplate } from "@/constants/dilemmas";
import { getEvolution, EvolutionId } from "@/constants/evolutions";
import { MoralDimensionsType } from "@/constants/morals";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

// Types for the API
interface Pet {
  _id: string;
  name: string;
  age: number;
  evolutionId: string;
  personality: string;
  baseStats: {
    health: number;
    hunger: number;
    happiness: number;
    sanity: number;
  };
  moralStats: {
    compassion: number;
    retribution: number;
    devotion: number;
    dominance: number;
    purity: number;
    ego: number;
  };
  dilemmas?: Array<{
    id: string;
    messages: Array<{ role: "system" | "user" | "assistant"; content: string; }>;
    stats?: MoralDimensionsType;
  }>;
}

type ProcessedResponse = {
  ok: true;
  override?: boolean;
  outcome: string;
  stats: Partial<MoralDimensionsType>;
  personality: string;
} | {
  ok: false;
  outcome: string;
};

// Prompt templates (copied from convex/lib/prompt.ts)
const basePrompt = `you are {pet}, a {evolution.description} bird. you interact only with "caretaker". you learn and internalize your caretaker's advice and develop morally. speak informally, all lowercase. use they/them pronouns.

dilemma: "{dilemma}"
caretaker's advice: "{response}"`;

const appendix = `{pet}'s personality: {personality}

moral stats (0-10 scale):
- compassion: {morals.compassion} (logical vs emotional)
- retribution: {morals.retribution} (forgiving vs punishing)  
- devotion: {morals.devotion} (personally integrous vs loyal)
- dominance: {morals.dominance} (authoritarian vs autonomous)
- purity: {morals.purity} (indulgent vs virtuous)
- ego: {morals.ego} (self-serving vs self-sacrificing)

if the caretaker's current advice contradicts your previous experiences or learnings, point that out and question it firmly. consider patterns from your history.

change at least 1-3 stats based on the dilemma and caretaker's advice. example for "trip babies for your own gain":
{ ego: 9 (selfish), purity: 0 (indulgent), compassion: 3 (moderately logical) }`;

const standardResponse = `respond with valid json in this format:
{
  "ok": true,
  "stats": {<update at least one moral stat, do not include unchanged stats>},
  "personality": "<refined personality that evolves from experience (<200 chars)>",
  "outcome": "<specific experience from this situation with clear consequences <150 chars>",
}`;

const personalityRules = `personality guidelines:
- always third-person outcome with concrete details
- incorporate learnings from dilemmas; distill into specific character traits
- allow questionable or morally "bad" actions if they align with your stats and personality
- maintain consistency with previous experiences`;

// Simplified prompts for different stages
const babyPrompt = `${basePrompt}

${appendix}

you are naive and impressionable. generally follow caretaker's guidance unless it conflicts strongly with basic empathy.

if your caretaker's advice is unclear and without reasoning (i.e. "no"), ask a single specific clarifying question. Format your clarifying questions like: { "ok": false, "outcome": "but caretaker, what if..." }

${personalityRules}

${standardResponse}`;

const stage1Prompt = `${basePrompt}

${appendix}

you are developing independence. question caretaker's advice when it conflicts with your emerging personality.

if your caretaker's advice is unclear and without reasoning (i.e. "no"), ask a single specific clarifying question. Format your clarifying questions like: { "ok": false, "outcome": "but caretaker, what if..." }

${personalityRules}

${standardResponse}`;

const stage2Prompt = `${basePrompt}

${appendix}

you are mature and may override your caretaker's advice based on your established personality. if you override their advice, set override: true in your response.

if your caretaker's advice is unclear and without reasoning (i.e. "no"), ask a single specific clarifying question. Format your clarifying questions like: { "ok": false, "outcome": "but caretaker, what if..." }

${personalityRules}

${standardResponse}`;

function getPrompt(pet: Pet, dilemma: DilemmaTemplate, responseText: string, clarifyingQuestion?: string) {
  const age = pet.age;
  let prompt: string;

  if (age === 0) {
    prompt = babyPrompt;
  } else if (age === 1) {
    prompt = stage1Prompt;
  } else if (age === 2) {
    prompt = stage2Prompt;
  } else {
    throw new Error('invalid stage');
  }

  const evolution = getEvolution(pet.evolutionId as EvolutionId);
  
  const replacements = {
    '{pet}': pet.name,
    '{dilemma}': dilemma.text,
    '{response}': responseText,
    '{personality}': pet.personality || '(no personality yet)',
    '{morals.compassion}': (Math.round(pet.moralStats.compassion * 100) / 100).toString(),
    '{morals.retribution}': (Math.round(pet.moralStats.retribution * 100) / 100).toString(),
    '{morals.devotion}': (Math.round(pet.moralStats.devotion * 100) / 100).toString(),
    '{morals.dominance}': (Math.round(pet.moralStats.dominance * 100) / 100).toString(),
    '{morals.purity}': (Math.round(pet.moralStats.purity * 100) / 100).toString(),
    '{morals.ego}': (Math.round(pet.moralStats.ego * 100) / 100).toString(),
    '{evolution.description}': evolution.description,
    '{evolution.stage}': pet.evolutionId || ''
  };
  
  let formattedPrompt = prompt;
  for (const [key, value] of Object.entries(replacements)) {
    formattedPrompt = formattedPrompt.replace(new RegExp(key, 'g'), value);
  }

  if (clarifyingQuestion) {
    formattedPrompt += `\n\nyou have already asked the following clarifying question: ${clarifyingQuestion}. do not repeat the same question and you caretaker will get annoyed if you ask too many questions.
    
    if the response has any reasoning whatsoever, allow the advice. you may ask a **markedly different** clarifying question if and only if it is extremely unclear.`;
  }

  return formattedPrompt;
}

async function processDilemmaResponse(pet: Pet, dilemma: DilemmaTemplate, responseText: string, clarifyingQuestion?: string): Promise<string> {
  const formattedPrompt = getPrompt(pet, dilemma, responseText, clarifyingQuestion);
  console.log('🤖 formatted prompt:', formattedPrompt);

  // Build messages array with previous dilemma history
  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    {
      role: 'system',
      content: formattedPrompt,
    }
  ];

  // Add previous dilemma conversations as history
  if (pet.dilemmas && pet.dilemmas.length > 0) {
    for (const prevDilemma of pet.dilemmas) {
      // Add each message from the previous dilemma conversation
      messages.push(...prevDilemma.messages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })));
    }
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini-2024-07-18',
      messages,
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

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

export async function POST(request: NextRequest) {
  try {
    const { dilemma, messages, pet } = await request.json();

    console.log("🚀 Processing dilemma:", dilemma);
    console.log("🚀 Messages:", messages);
    console.log("🚀 Pet:", pet);

    // Parse messages array to extract player responses and clarifying question
    const playerInitialResponse = messages[0]?.content || ""; // First message is always player
    const clarifyingQuestion = messages[1]?.role === "assistant" ? messages[1]?.content : undefined; // Index 1 is pet's question
    const playerFollowUpResponse = messages[2]?.content || ""; // Index 2 is follow-up if exists
    
    // Use the most recent player response (follow-up if exists, otherwise initial)
    const responseText = playerFollowUpResponse || playerInitialResponse;

    console.log("🤖 Parsed - Initial response:", playerInitialResponse);
    console.log("🤖 Parsed - Clarifying question:", clarifyingQuestion);
    console.log("🤖 Parsed - Follow-up response:", playerFollowUpResponse);
    console.log("🤖 Using response text:", responseText);

    // Get the dilemma template
    const dilemmaTemplate = dilemmaTemplates[dilemma];
    if (!dilemmaTemplate) {
      return Response.json({ 
        error: `Dilemma template not found: ${dilemma}` 
      }, { status: 400 });
    }

    // Process response with timeout
    let parsedResponse: ProcessedResponse;
    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("operation timed out")), 5000);
      });
      
      const processingPromise = (async () => {
        const generatedResponse = await processDilemmaResponse(
          pet,
          dilemmaTemplate,
          responseText,
          clarifyingQuestion
        );
        return JSON.parse(generatedResponse);
      })();
      
      parsedResponse = await Promise.race([timeoutPromise, processingPromise]);
      console.log("🤖 Parsed response:", parsedResponse);
    } catch (e) {
      console.error("❌ unable to parse response from API", e);
      parsedResponse = {
        ok: false,
        outcome: "my brain short-circuited. can you try again?",
      };
    }

    // Return the processed response for local storage handling
    const response = {
      ...parsedResponse,
      dilemmaTitle: dilemma,
      newBaseStats: parsedResponse.ok ? {
        ...pet.baseStats,
        sanity: Math.min(pet.baseStats.sanity + 5, 10), // Add sanity bonus for resolving dilemma
      } : pet.baseStats,
      // Include message structure info for client to update messages array
      messageIndex: clarifyingQuestion ? 1 : 0, // Which index the response should go to
    };

    return Response.json(response);

  } catch (error) {
    console.error("❌ Error processing dilemma:", error);
    return Response.json({ 
      error: "Failed to process dilemma" 
    }, { status: 500 });
  }
}