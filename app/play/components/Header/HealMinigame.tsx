import Window from "@/components/Window";
import { useBaseStats } from "@/app/providers/PetProvider";
import { useState, useEffect } from "react";

export default function HealMinigame({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const { incrementStat } = useBaseStats();
  const [targetPosition, setTargetPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    if (isOpen) {
      // Generate random position for the "x" when minigame opens
      setTargetPosition({
        x: Math.random() * 80 + 10, // 10% to 90% from left
        y: Math.random() * 80 + 10, // 10% to 90% from top
      });
    }
  }, [isOpen]);

  const handleTargetClick = () => {
    incrementStat("health" as keyof import("@/constants/base").BaseStatsType);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="flex w-full h-50">
      <Window
        title="click to apply bandaid (+30 health)"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <div className="p-3">
          <div className="relative w-full h-40 bg-zinc-50 border-2">
            <button
              className="absolute w-8 h-8 bg-red-500 text-white font-bold text-lg hover:bg-red-600 transition-colors duration-200 flex items-center justify-center"
              style={{
                left: `${targetPosition.x}%`,
                top: `${targetPosition.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              onClick={handleTargetClick}
            >
              ✕
            </button>
          </div>
        </div>
      </Window>
    </div>
  );
}
