import { dilemmaTemplates } from "../../constants/dilemmas";
import { Doc } from "../_generated/dataModel";

// partition into seen & unseen dilemmas
export function getPartitionedDilemmas(allDilemmas: Doc<"dilemmas">[]): {
  seenDilemmas: Doc<"dilemmas">[];
  unseenDilemmaTitles: string[];
  unresolvedDilemma?: Doc<"dilemmas">;
} {
  // filter dilemmas to get seen and unresolved
  const { seenDilemmas, unresolvedDilemmas } = allDilemmas.reduce(
    (
      acc: {
        seenDilemmas: Doc<"dilemmas">[];
        unresolvedDilemmas: Doc<"dilemmas">[];
      },
      dilemma
    ) => {
      if (dilemma.resolved) {
        acc.seenDilemmas.push(dilemma);
      } else {
        acc.unresolvedDilemmas.push(dilemma);
      }
      return acc;
    },
    { seenDilemmas: [], unresolvedDilemmas: [] }
  );

  // if any unresolved dilemmas, return the clarifying question
  const seenDilemmaTitles = seenDilemmas.map((d) => d.title);
  if (unresolvedDilemmas.length > 0) {
    for (const dilemma of unresolvedDilemmas) {
      // dilemma is still loading, so skip it
      if (!dilemma.outcome) {
        continue;
      }

      return {
        seenDilemmas,
        unseenDilemmaTitles: [], // should never be read from
        unresolvedDilemma: dilemma,
      };
    }
  }

  // filter out seen dilemmas from all dilemmas
  const unseenDilemmaTitles = Object.keys(dilemmaTemplates).filter(
    (title) => !seenDilemmaTitles.includes(title)
  );

  return {
    seenDilemmas,
    unseenDilemmaTitles,
  };
}
