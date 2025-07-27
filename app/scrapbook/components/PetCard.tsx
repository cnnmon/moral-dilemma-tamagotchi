import { getSprite, Animation } from "@/constants/sprites";
import { EvolutionId } from "@/constants/evolutions";
import Image from "next/image";
import { Pet } from "@/app/storage/pet";

export default function PetCard({
  pet,
  setSelectedPet,
}: {
  pet: Pet;
  setSelectedPet: (pet: Pet) => void;
}) {
  const sprite = getSprite(
    Animation.HAPPY,
    pet.evolutionIds[pet.evolutionIds.length - 1] as EvolutionId
  );
  return (
    <>
      {/* polaroid-style card */}
      <div
        className="bg-white border-2 border-zinc-800 p-2 shadow-md hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-1 rotate-1 hover:rotate-0 duration-300 w-36"
        onClick={() => setSelectedPet(pet)}
      >
        <div className="bg-zinc-100 border-2 border-zinc-800 p-1 mb-2 h-32 flex items-center justify-center overflow-hidden">
          <Image
            src={sprite}
            alt={pet.name}
            width={100}
            height={100}
            className="object-contain"
          />
        </div>
        <div className="text-center">
          <h3 className="font-bold text-lg">{pet.name}</h3>
        </div>
        <div className="absolute top-1 right-1 w-4 h-4 bg-zinc-200 rounded-full border border-zinc-300"></div>
      </div>
    </>
  );
}
