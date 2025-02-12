import { Doc } from "@/convex/_generated/dataModel";
import Stat from "./Stat";

export function BaseStats({ pet }: { pet: Doc<"pets"> }) {
  return (
    <div>
      <Stat label="health" value={20} />
      <Stat label="hunger" value={pet.baseStats.hunger * 10} />
      <Stat label="happiness" value={pet.baseStats.happiness * 10} />
      <Stat label="sanity" value={pet.baseStats.sanity * 10} />
    </div>
  );
}
