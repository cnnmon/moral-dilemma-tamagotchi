"use client";

import { useEffect, useState } from "react";
import Scrapbook from "./components/Scrapbook";
import { getPets, Pet } from "../storage/pet";

export default function ScrapbookPage() {
  const [pets, setPets] = useState<Pet[]>([]);
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
        <div>Loading your scrapbook...</div>
      </div>
    );
  }

  return <Scrapbook pets={pets} setSelectedPet={() => {}} />;
}
