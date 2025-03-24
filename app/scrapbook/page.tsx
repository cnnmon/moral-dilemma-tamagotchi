"use client";

import Scrapbook from "./components/Scrapbook";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Window from "@/components/Window";
import Menu from "@/components/Menu";
import { useState } from "react";
import { Doc } from "@/convex/_generated/dataModel";
import Graduation from "../play/components/Graduation";

export default function ScrapbookPage() {
  const petsQuery = useQuery(api.pets.getAllPetsForUser);
  const [selectedPet, setSelectedPet] = useState<Doc<"pets"> | null>(null);

  return (
    <>
      <div className="flex flex-col items-center justify-center sm:w-2xl w-full min-h-screen">
        <Menu page="scrapbook" />
        <div className="px-4">
          <Window title="family scrapbook" isOpen={true}>
            <Scrapbook petsQuery={petsQuery} setSelectedPet={setSelectedPet} />
          </Window>
        </div>
      </div>
      {selectedPet && (
        <Graduation
          pet={selectedPet}
          graduationOpen={selectedPet !== null}
          setGraduationOpen={() => setSelectedPet(null)}
        />
      )}
    </>
  );
}
