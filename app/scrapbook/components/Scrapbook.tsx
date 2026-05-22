"use client";

import PetCard from "./PetCard";
import { Pet } from "@/app/storage/pet";

const PETS_PER_SIDE = 2;
const PER_PAGE = PETS_PER_SIDE * 2;

function getLatestPetsById(pets: Pet[]) {
  const latestPetsById = new Map<string, Pet>();

  for (let i = pets.length - 1; i >= 0; i -= 1) {
    const pet = pets[i];
    if (!latestPetsById.has(pet.id)) {
      latestPetsById.set(pet.id, pet);
    }
  }

  return Array.from(latestPetsById.values()).reverse();
}

export function getScrapbookPage(pets: Pet[], page: number) {
  const graduatedPets = getLatestPetsById(pets).filter((p) => p.age >= 2);
  const totalPages = Math.max(1, Math.ceil(graduatedPets.length / PER_PAGE));
  const clampedPage = Math.min(page, totalPages - 1);
  const pageStart = clampedPage * PER_PAGE;

  return {
    left: graduatedPets.slice(pageStart, pageStart + PETS_PER_SIDE),
    right: graduatedPets.slice(pageStart + PETS_PER_SIDE, pageStart + PER_PAGE),
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
    <div className="flex w-full justify-around px-9 ml-[-20px]">
      {[left, right].map((sidePets, sideIndex) => (
        <div
          key={sideIndex}
          className="grid grid-cols-2 place-items-center gap-4"
        >
          {sidePets.map((pet) => (
            <PetCard key={pet.id} pet={pet} setSelectedPet={setSelectedPet} />
          ))}
        </div>
      ))}
    </div>
  );
}
