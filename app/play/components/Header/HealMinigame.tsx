import Window from "@/components/Window";
import { useBaseStats } from "@/app/providers/PetProvider";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function HealMinigame({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const { incrementStat } = useBaseStats();
  const [targetPosition, setTargetPosition] = useState({ x: 50, y: 50 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseInBox, setIsMouseInBox] = useState(false);

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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => {
    setIsMouseInBox(true);
  };

  const handleMouseLeave = () => {
    setIsMouseInBox(false);
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
          <div
            className="relative w-full h-40 bg-zinc-50 border-2 bg-zinc-200 overflow-hidden"
            style={{ cursor: "none" }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {isMouseInBox && (
              <div
                className="absolute pointer-events-none z-10"
                style={{
                  left: `${mousePosition.x}px`,
                  top: `${mousePosition.y}px`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <Image
                  src="/bandaid.png"
                  alt="Bandaid cursor"
                  width={120}
                  height={120}
                />
              </div>
            )}
            <button
              className="absolute font-bold hover:opacity-50 transition-colors duration-200 flex items-center justify-center rounded-full bg-zinc-300 w-15 h-15"
              style={{
                left: `${targetPosition.x}%`,
                top: `${targetPosition.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              onClick={handleTargetClick}
            >
              <Image
                src="/x.svg"
                alt="X"
                className="scale-170 opacity-60"
                width={120}
                height={120}
              />
            </button>
          </div>
        </div>
      </Window>
    </div>
  );
}
