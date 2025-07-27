import { evolutions } from "@/constants/evolutions";
import PetCard from "./PetCard";
import { Pet } from "@/app/storage/pet";

export default function Scrapbook({
  pets,
  setSelectedPet,
}: {
  pets?: Pet[];
  setSelectedPet: (pet: Pet | null) => void;
}) {
  if (pets === undefined) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 bg-zinc-200">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="relative">
            <div className="h-60 bg-zinc-300 w-36 animate-pulse flex items-center justify-center"></div>
          </div>
        ))}
      </div>
    );
  }

  const graduatedPets = pets.filter((pet) => pet.age >= 2);

  // count number of unique evolutions collected
  const evolutionSet = new Set(
    graduatedPets.flatMap((pet) => pet.evolutionIds)
  );
  const evolutionCount = evolutionSet.size;
  const evolutionText =
    evolutionCount === 0
      ? "no evolutions yet"
      : evolutionCount === 1
        ? "1 evolution"
        : `${evolutionCount} evolutions`;

  return (
    <div className="flex flex-col gap-2 bg-zinc-200 w-full p-3 text-lg">
      <p className="text-zinc-500 italic">
        {evolutionText} collected out of {Object.keys(evolutions).length}
      </p>
      {graduatedPets.length === 0 && (
        <p className="text-zinc-500 italic">
          no graduated pets yet! come back when you&apos;ve been a more
          committed parent...
        </p>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-4">
        {graduatedPets.map((pet) => (
          <div key={pet.id} className="relative">
            <PetCard pet={pet} setSelectedPet={setSelectedPet} />
          </div>
        ))}
      </div>
    </div>
  );
}
