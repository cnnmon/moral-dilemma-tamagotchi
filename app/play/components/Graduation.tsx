import { EvolutionId, getEvolution } from "@/constants/evolutions";
import { dilemmaTemplates } from "@/constants/dilemmas";
import { Doc } from "@/convex/_generated/dataModel";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { getMoralStatsWritten } from "@/constants/morals";

export default function Graduation({
  pet,
  seenDilemmas,
}: {
  pet: Doc<"pets">;
  seenDilemmas: Doc<"dilemmas">[];
}) {
  const moralData = [
    { subject: "compassion", value: pet.moralStats.compassion },
    { subject: "retribution", value: pet.moralStats.retribution },
    { subject: "devotion", value: pet.moralStats.devotion },
    { subject: "dominance", value: pet.moralStats.dominance },
    { subject: "purity", value: pet.moralStats.purity },
    { subject: "ego", value: pet.moralStats.ego },
  ];

  const evolution = getEvolution(pet.evolutionId as EvolutionId);
  return (
    <div className="w-2xl my-[20%] border-2 border-black bg-zinc-100 p-4">
      <h3 className="text-2xl font-bold">{pet.name} has graduated!</h3>
      <p>
        {evolution.id}: {evolution.description}
      </p>
      <br />
      <p className="font-bold">Personality</p>
      <p>{pet.personality}</p>
      <br />
      <p className="font-bold">Moral Stats</p>
      <div className="w-full flex justify-center">
        <RadarChart width={300} height={300} data={moralData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis domain={[0, 10]} />
          <Radar
            name="Morals"
            dataKey="value"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
        </RadarChart>
      </div>
      <br />
      <p className="font-bold">Dilemmas</p>
      <div className="flex flex-col gap-2">
        {seenDilemmas.map((dilemma) => {
          const dilemmaTemplate = dilemmaTemplates[dilemma.title];
          if (!dilemma.updatedMoralStats) {
            return null;
          }
          const writtenStats = getMoralStatsWritten(dilemma.updatedMoralStats);
          return (
            <div key={dilemma._id} className="mb-4">
              <p>{dilemmaTemplate.text.replace("{pet}", pet.name)}</p>
              <p>caretaker&apos; said, &quot;{dilemma.responseText}&quot;</p>
              <p>then: {dilemma.outcome}</p>
              <p className="flex gap-2">
                {writtenStats.map((stat) => (
                  <span key={stat.key}>{stat.description}</span>
                ))}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
