import PetCard from "./PetCard";
import { useMemo } from "react";
import { Doc } from "@/convex/_generated/dataModel";

export default function Scrapbook({
  petsQuery,
}: {
  petsQuery?: Array<Doc<"pets">>;
}) {
  const pets = useMemo(() => petsQuery || [], [petsQuery]);
  if (petsQuery === undefined) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 p-8 bg-zinc-200">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="relative">
            <div className="h-50 bg-zinc-300 w-34 animate-pulse flex items-center justify-center"></div>
          </div>
        ))}
      </div>
    );
  }

  const graduatedPets = pets.filter((pet) => pet.age >= 2);
  if (graduatedPets.length === 0) {
    return (
      <div className="p-4 bg-red-100 border-b-2 border-red-500">
        <div className="flex items-center">
          <span className="text-red-600 text-2xl mr-2">⚠️</span>
          <p className="text-xl font-bold mb-1">no graduated pets yet!</p>
        </div>
        <p className="text-sm text-gray-700 mt-2">
          <a href="/create" className="underline">
            graduate a pet
          </a>{" "}
          to see them in the scrapbook
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 p-8 bg-zinc-200">
      {graduatedPets.map((pet) => (
        <div key={pet._id} className="relative">
          <PetCard pet={pet} />
        </div>
      ))}
    </div>
  );
}
