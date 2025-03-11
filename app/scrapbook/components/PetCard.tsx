import { Doc } from "@/convex/_generated/dataModel";
import { getSprite, Animation } from "@/constants/sprites";
import { EvolutionId } from "@/constants/evolutions";
import Image from "next/image";
import { useMemo, useState } from "react";
import Graduation from "@/app/play/components/Graduation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function PetCard({ pet }: { pet: Doc<"pets"> }) {
  const dilemmas = useQuery(api.dilemmas.getSeenDilemmas, { petId: pet._id });
  const seenDilemmas = useMemo(() => dilemmas || [], [dilemmas]);
  const [graduationOpen, setGraduationOpen] = useState(false);
  const sprite = getSprite(
    pet.age,
    Animation.HAPPY,
    pet.evolutionId as EvolutionId
  );
  const creationDate = new Date(pet._creationTime);
  const formattedDate = `${creationDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;

  return (
    <>
      {/* polaroid-style card */}
      <div
        className="bg-white border-2 border-zinc-800 p-2 shadow-md hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-1 rotate-1 hover:rotate-0 duration-300"
        onClick={() => setGraduationOpen(true)}
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
          <p className="text-xs text-zinc-500 italic">{formattedDate}</p>
          <p className="text-sm mt-1 line-clamp-2 overflow-hidden text-zinc-700">
            {pet.personality.substring(0, 60)}
            {pet.personality.length > 60 ? "..." : ""}
          </p>
        </div>
        <div className="absolute top-1 right-1 w-4 h-4 bg-zinc-200 rounded-full border border-zinc-300"></div>
      </div>

      {/* graduation modal */}
      {graduationOpen && (
        <div
          className="fixed top-0 w-full z-30 inset-0 flex justify-center items-center bg-white/50"
          onClick={() => setGraduationOpen(false)}
        >
          <Graduation
            pet={pet}
            seenDilemmas={seenDilemmas}
            graduationOpen={graduationOpen}
            setGraduationOpen={setGraduationOpen}
          />
        </div>
      )}
    </>
  );
}
