"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import PetCard from "./PetCard";
import { useMemo } from "react";

export default function Scrapbook() {
  const petsQuery = useQuery(api.pets.getAllPetsForUser);
  const pets = useMemo(() => petsQuery || [], [petsQuery]);

  // filter out only graduated pets (age >= 2)
  const graduatedPets = pets.filter((pet) => pet.age >= 2);

  // if loading
  if (petsQuery === undefined) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-8 bg-zinc-100 border-2 border-zinc-800">
        {[...Array(10)].map((_, index) => (
          <div key={index} className="relative">
            <div className="h-50 bg-zinc-200 w-35 animate-pulse flex items-center justify-center"></div>
          </div>
        ))}
      </div>
    );
  }

  // if no pets are found
  if (graduatedPets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-white border-2 border-zinc-800 p-8 shadow-md max-w-md">
          <h2 className="text-xl font-bold mb-4">no graduated pets yet!</h2>
          <p className="mb-4">
            your scrapbook is empty. raise a pet to adulthood to add them to
            your collection.
          </p>
          <a
            href="/play"
            className="inline-block bg-zinc-800 text-white px-4 py-2 rounded hover:bg-zinc-700 transition-colors"
          >
            raise a pet
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* polaroid-style grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-8 bg-zinc-100 border-2 border-zinc-800">
        {graduatedPets.map((pet) => (
          <div key={pet._id} className="relative">
            <PetCard pet={pet} />
          </div>
        ))}
      </div>

      {/* scrapbook decorations */}
      <div className="flex justify-between mt-4">
        <div className="text-sm text-zinc-500 italic">my pet memories</div>
        <div className="text-sm text-zinc-500">
          est. {new Date().getFullYear()}
        </div>
      </div>
    </>
  );
}
