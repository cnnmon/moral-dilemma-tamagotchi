"use client";

import { useEffect, useState } from "react";
import Scrapbook from "./components/Scrapbook";
import { getPets, Pet } from "../storage/pet";
import Graduation from "../play/components/Graduation";
import Loading from "../play/components/Loading";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Background } from "@/components/Background";
import Image from "next/image";

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
    <>
      <motion.div
        key="create-page"
        className="flex flex-col items-center gap-4 w-full sm:w-xl p-4 sm:p-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Background backgroundSrcs={["/scrapbook.png"]}>
          <Image
            src="/egg.gif"
            alt="egg"
            width={180}
            height={180}
            className="no-select"
          />
        </Background>
        <br />

        <Scrapbook pets={pets} setSelectedPet={setSelectedPet} />
        {selectedPet && (
          <Graduation
            pet={selectedPet}
            graduationOpen={selectedPet !== null}
            setGraduationOpen={() => setSelectedPet(null)}
          />
        )}
      </motion.div>
    </>
  );
}
