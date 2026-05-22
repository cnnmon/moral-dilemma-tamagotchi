"use client";

import { useEffect, useState } from "react";
import Scrapbook, { getScrapbookPage } from "./components/Scrapbook";
import EvolutionGraphModal from "./components/EvolutionGraphModal";
import { getPets, Pet } from "../storage/pet";
import Graduation from "../play/components/Graduation";
import Loading from "../play/components/Loading";
import { motion } from "framer-motion";
import { Background } from "@/components/Background";
import { evolutions } from "@/constants/evolutions";

export default function ScrapbookPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [evolutionGraphOpen, setEvolutionGraphOpen] = useState(false);

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

  const { clampedPage, totalPages, graduatedPets } = getScrapbookPage(pets, page);
  const canPrev = clampedPage > 0;
  const canNext = clampedPage < totalPages - 1;

  const evolutionSet = new Set(graduatedPets.flatMap((p) => p.evolutionIds));
  const evolutionText = `${evolutionSet.size} evolutions collected out of ${Object.keys(evolutions).length}`;

  return (
    <>
      <motion.div
        key="create-page"
        className="flex flex-col items-center gap-2 w-full sm:w-xl p-4 sm:p-0 relative text-lg select-none"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative w-full">
          <Background backgroundSrcs={["/scrapbook.png"]}><div /></Background>
          <div className="absolute inset-0 flex items-center">
            <Scrapbook pets={pets} page={clampedPage} setSelectedPet={setSelectedPet} />
          </div>
        </div>

        {/* pagination + meta — outside and below the book */}
        <div className="flex items-center gap-3 text-zinc-500">
          <a
            onClick={() => canPrev && setPage(clampedPage - 1)}
            className={`transition-opacity ${canPrev ? "cursor-pointer hover:opacity-70" : "opacity-30 pointer-events-none"}`}
          >
            prev page
          </a>
          <span>{clampedPage + 1} / {totalPages}</span>
          <a
            onClick={() => canNext && setPage(clampedPage + 1)}
            className={`transition-opacity ${canNext ? "cursor-pointer hover:opacity-70" : "opacity-30 pointer-events-none"}`}
          >
            next page
          </a>
        </div>

        <div className="flex gap-2">
          {evolutionText} <a className="cursor-pointer text-zinc-500 italic hover:opacity-70" onClick={() => setEvolutionGraphOpen(true)}>(see all)</a>
        </div>

        {graduatedPets.length === 0 && (
          <p className="text-zinc-500 italic">
            no graduated pets yet! come back when you&apos;ve been a more committed parent...
          </p>
        )}

        {selectedPet && (
          <Graduation
            pet={selectedPet}
            graduationOpen={selectedPet !== null}
            setGraduationOpen={() => setSelectedPet(null)}
          />
        )}

        <EvolutionGraphModal
          isOpen={evolutionGraphOpen}
          evolutionSet={evolutionSet}
          onClose={() => setEvolutionGraphOpen(false)}
        />
      </motion.div>
    </>
  );
}
