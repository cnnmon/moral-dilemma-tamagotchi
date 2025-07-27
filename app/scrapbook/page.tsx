"use client";

import { useEffect, useState } from "react";
import Scrapbook from "./components/Scrapbook";
import { getPets, Pet } from "../storage/pet";
import Graduation from "../play/components/Graduation";
import Loading from "../play/components/Loading";
import { useRouter } from "next/navigation";

export default function ScrapbookPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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
      <div className="flex flex-col items-center justify-center pb-2">
        <a
          className="text-zinc-500 underline hover:text-white hover:bg-zinc-500"
          onClick={() => router.push("/play")}
        >
          back
        </a>
      </div>
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
