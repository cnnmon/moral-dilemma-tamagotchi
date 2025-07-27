import Window from "@/components/Window";
import Certificate from "./Certificate";
import PetInfo from "./PetInfo";
import EvolutionJourney from "./EvolutionJourney";
import MoralAttributes from "./MoralAttributes";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { EvolutionId } from "@/constants/evolutions";
import { Pet } from "@/app/storage/pet";

export default function Graduation({
  pet,
  graduationOpen,
  setGraduationOpen,
}: {
  pet: Pet;
  graduationOpen: boolean;
  setGraduationOpen: (open: boolean) => void;
}) {
  const [hoveredEvolutionId, setHoveredEvolutionId] = useState<
    EvolutionId | undefined
  >(undefined);

  if (!pet) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed inset-0 flex items-start md:items-center justify-center md:p-4 z-30"
        onClick={() => setGraduationOpen(false)}
      >
        <motion.div
          className="w-full max-w-4xl max-h-screen overflow-y-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Window
            title={`${pet.name}'s graduation certificate`}
            isOpen={graduationOpen}
            setIsOpen={() => setGraduationOpen(false)}
          >
            <Certificate>
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 p-2">
                <PetInfo pet={pet} hoveredEvolutionId={hoveredEvolutionId} />
                <div className="md:w-1/2 space-y-6">
                  <EvolutionJourney
                    pet={pet}
                    hoveredEvolutionId={hoveredEvolutionId}
                    onHover={(evolutionId) =>
                      setHoveredEvolutionId(evolutionId)
                    }
                  />
                  <MoralAttributes pet={pet} />
                </div>
              </div>
            </Certificate>
          </Window>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
