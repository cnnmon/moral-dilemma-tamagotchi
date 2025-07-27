"use client";

import { useEffect, useState } from "react";
import Scrapbook from "./components/Scrapbook";
import { getPets, Pet } from "../storage/pet";
import Menu from "@/components/Menu";
import Graduation from "../play/components/Graduation";
import Loading from "../play/components/Loading";

export default function ScrapbookPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const pets = getPets();
      setPets(pets);
    } catch (error) {
      console.error("Error loading pets:", error);
      setPets([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-0 sm:w-xl w-full">
      <Menu page="scrapbook" />
      <Scrapbook pets={pets} setSelectedPet={setSelectedPet} />
      {selectedPet && (
        <Graduation
          pet={selectedPet}
          graduationOpen={selectedPet !== null}
          setGraduationOpen={() => setSelectedPet(null)}
        />
      )}
    </div>
  );
}
