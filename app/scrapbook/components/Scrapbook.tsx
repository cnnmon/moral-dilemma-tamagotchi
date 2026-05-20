"use client";

import PetCard from "./PetCard";
import { Pet } from "@/app/storage/pet";

const PER_PAGE = 2;

export function getScrapbookPage(pets: Pet[], page: number) {
  const graduatedPets = pets.filter((p) => p.age >= 2);
  const totalPages = Math.max(1, Math.ceil(graduatedPets.length / PER_PAGE));
  const clampedPage = Math.min(page, totalPages - 1);
  return {
    left: graduatedPets[clampedPage * PER_PAGE] ?? null,
    right: graduatedPets[clampedPage * PER_PAGE + 1] ?? null,
    clampedPage,
    totalPages,
    graduatedPets,
  };
}

export default function Scrapbook({
  pets,
  page,
  setSelectedPet,
}: {
  pets?: Pet[];
  page: number;
  setSelectedPet: (pet: Pet | null) => void;
}) {
  if (pets === undefined) {
    return <div className="h-10 w-full bg-zinc-300 animate-pulse" />;
  }

  const { left, right } = getScrapbookPage(pets, page);

  return (
    <div className="flex w-full justify-around px-8">
      <div className="flex items-center justify-center w-1/2">
        {left ? <PetCard pet={left} setSelectedPet={setSelectedPet} /> : null}
      </div>
      <div className="flex items-center justify-center w-1/2">
        {right ? <PetCard pet={right} setSelectedPet={setSelectedPet} /> : null}
      </div>
    </div>
  );
}
