import { NextRequest } from "next/server";
import OpenAI from 'openai';
import { dilemmaTemplates } from "@/constants/dilemmas";
import { MoralDimensionsType } from "@/constants/morals";
import { ActiveDilemma, Pet } from "@/app/storage/pet";
import { evolvePetIfNeeded, getAverageMoralStats } from "./evolve";
import { getPrompt } from "./prompt";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

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

async function processDilemmaResponse(pet: Pet, dilemma: ActiveDilemma): Promise<string> {
  const formattedPrompt = getPrompt(pet, dilemma);
  console.log('🤖 formatted prompt:', formattedPrompt);

  const messages = [
    { role: 'system' as const, content: formattedPrompt },
    ...dilemma.messages,
  ];

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
    const { dilemma, pet } = await request.json();

    console.log("🚀 Processing dilemma:", dilemma);
    console.log("🚀 Pet:", pet);

    // Get the dilemma template
    const dilemmaTemplate = dilemmaTemplates[dilemma.id];
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
          dilemma
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

    // Handle evolution if dilemma is resolved
    let evolutionUpdate = {};
    if (parsedResponse.ok) {
      // Get resolved dilemmas (including current one)
      const resolvedDilemmas = pet.dilemmas.filter((d: { stats?: MoralDimensionsType }) => d.stats);
      
      if (parsedResponse.stats) {
        // Add current dilemma stats to resolved list for evolution calculation
        const averageMoralStats = getAverageMoralStats([...resolvedDilemmas, { stats: parsedResponse.stats }]);
        const evolutionResult = evolvePetIfNeeded(resolvedDilemmas.length + 1, pet, averageMoralStats);
        
        if (evolutionResult) {
          console.log("🐦 Pet evolving:", evolutionResult);
          evolutionUpdate = {
            evolutionIds: [...pet.evolutionIds, evolutionResult.evolutionId],
            age: evolutionResult.age,
          };
        } else {
          evolutionUpdate = {
            moralStats: { ...pet.moralStats, ...parsedResponse.stats }, // Just update with new stats
          };
        }
      }
    }

    // Return the processed response for local storage handling
    const response = {
      ...parsedResponse,
      ...evolutionUpdate,
    };

    return Response.json(response);

  } catch (error) {
    console.error("❌ Error processing dilemma:", error);
    return Response.json({ 
      error: "Failed to process dilemma" 
    }, { status: 500 });
  }
}