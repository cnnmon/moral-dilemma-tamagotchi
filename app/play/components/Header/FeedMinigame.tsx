import Window from "@/components/Window";
import { useBaseStats } from "@/app/providers/PetProvider";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function FeedMinigame({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const { incrementStat } = useBaseStats();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseInBox, setIsMouseInBox] = useState(false);
  const [shakeProgress, setShakeProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const mouseHistoryRef = useRef<{ x: number; y: number; timestamp: number }[]>(
    []
  );
  const shakeRequirement = 3; // Number of direction changes needed

  const resetGame = () => {
    setShakeProgress(0);
    setIsComplete(false);
    mouseHistoryRef.current = [];
  };

  useEffect(() => {
    if (isOpen) {
      resetGame();
    }
  }, [isOpen]);

  const detectShake = (newX: number, newY: number) => {
    const now = Date.now();
    const history = mouseHistoryRef.current;

    // Add current position to history
    history.push({ x: newX, y: newY, timestamp: now });

    // Keep only recent history (last 1 second)
    mouseHistoryRef.current = history.filter(
      (pos) => now - pos.timestamp < 1000
    );

    if (history.length < 4) return;

    // Calculate direction changes
    let directionChanges = 0;
    for (let i = 2; i < history.length; i++) {
      const prev2 = history[i - 2];
      const prev1 = history[i - 1];
      const curr = history[i];

      const direction1 = { x: prev1.x - prev2.x, y: prev1.y - prev2.y };
      const direction2 = { x: curr.x - prev1.x, y: curr.y - prev1.y };

      // Check if direction changed significantly (dot product < 0 means opposite directions)
      const dotProduct =
        direction1.x * direction2.x + direction1.y * direction2.y;
      const magnitude1 = Math.sqrt(direction1.x ** 2 + direction1.y ** 2);
      const magnitude2 = Math.sqrt(direction2.x ** 2 + direction2.y ** 2);

      if (magnitude1 > 5 && magnitude2 > 5 && dotProduct < 0) {
        directionChanges++;
      }
    }

    setShakeProgress(Math.min(directionChanges, shakeRequirement));

    if (directionChanges >= shakeRequirement && !isComplete) {
      setIsComplete(true);
      setTimeout(() => {
        incrementStat(
          "hunger" as keyof import("@/constants/base").BaseStatsType
        );
        setIsOpen(false);
      }, 500);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const newX = e.clientX - rect.left;
    const newY = e.clientY - rect.top;

    setMousePosition({ x: newX, y: newY });
    detectShake(newX, newY);
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
        title={`shake to feed (+30 hunger) ${shakeProgress}/${shakeRequirement}`}
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
                  src="/actions/feed.png"
                  alt="Feed cursor"
                  width={60}
                  height={60}
                  className={isComplete ? "animate-bounce" : ""}
                />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg mb-2">
                  {isComplete ? "fed!" : "shake the feed!"}
                </div>
                <div className="flex justify-center space-x-1">
                  {Array.from({ length: shakeRequirement }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-4 h-4 rounded-full border-2 ${
                        i < shakeProgress ? "bg-black" : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Window>
    </div>
  );
}
