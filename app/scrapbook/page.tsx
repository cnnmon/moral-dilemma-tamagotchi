"use client";

import { useEffect, useState } from "react";
import Scrapbook from "./components/Scrapbook";
import { Doc } from "@/convex/_generated/dataModel";
import { getLocalPets } from "@/app/utils/localStorage";

export default function ScrapbookPage() {
  const [pets, setPets] = useState<Doc<"pets">[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load pets from local storage
    try {
      const localPets = getLocalPets();
      setPets(localPets);
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

  return <Scrapbook petsQuery={pets} setSelectedPet={() => {}} />;
}
