import Window from "@/components/Window";
import { useBaseStats, usePet } from "@/app/providers/PetProvider";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Animation, getSprite } from "@/constants/sprites";

export default function PlayMinigame({ onClose }: { onClose: () => void }) {
  const { incrementStat } = useBaseStats();
  const { pet } = usePet();
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const petSprite = pet
    ? getSprite(Animation.HAPPY, pet.evolutionIds[pet.evolutionIds.length - 1]) ?? getSprite(Animation.IDLE, pet.evolutionIds[pet.evolutionIds.length - 1])
    : null;
  const animationRef = useRef<number>();

  const [ballPosition, setBallPosition] = useState({ x: 50, y: 50 });
  const [ballVelocity, setBallVelocity] = useState({ x: 14, y: 14 });
  const [paddlePosition, setPaddlePosition] = useState(50);
  const [bounceCount, setBounceCount] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const lastTimeRef = useRef<number>(0);

  const gameWidth = 100; // percentage
  const gameHeight = 100; // percentage
  const paddleWidth = 20; // percentage
  const paddleHeight = 3; // percentage
  const ballSize = 12; // percentage

  const resetGame = useCallback(() => {
    setBallPosition({ x: 50, y: 20 });
    setBallVelocity({ x: (Math.random() - 0.5) * 60, y: 120 });
    setBounceCount(0);
    setGameStarted(false);
    lastTimeRef.current = 0;
  }, []);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  // Handle game completion when bounceCount reaches 2
  useEffect(() => {
    if (bounceCount >= 2) {
      incrementStat("happiness" as keyof import("@/constants/base").BaseStatsType);
      onClose();
    }
  }, [bounceCount, incrementStat, onClose]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!gameAreaRef.current) return;
      const rect = gameAreaRef.current.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
      setPaddlePosition(
        Math.max(paddleWidth / 2, Math.min(100 - paddleWidth / 2, mouseX)),
      );
    },
    [paddleWidth],
  );

  const startGame = () => {
    setGameStarted(true);
  };

  useEffect(() => {
    if (!gameStarted || !gameAreaRef.current) return;

    const updateGame = (currentTime: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = currentTime;
      }

      const deltaTime = (currentTime - lastTimeRef.current) / 1000; // Convert to seconds
      lastTimeRef.current = currentTime;

      setBallPosition((prevPos) => {
        const newPos = {
          x: prevPos.x + ballVelocity.x * deltaTime,
          y: prevPos.y + ballVelocity.y * deltaTime,
        };

        setBallVelocity((prevVel) => {
          const newVel = { ...prevVel };

          // Bounce off left and right walls
          if (
            newPos.x <= ballSize / 2 ||
            newPos.x >= gameWidth - ballSize / 2
          ) {
            newVel.x = -newVel.x;
            newPos.x = Math.max(
              ballSize / 2,
              Math.min(gameWidth - ballSize / 2, newPos.x),
            );
          }

          // Bounce off top wall
          if (newPos.y <= ballSize / 2) {
            newVel.y = -newVel.y;
            newPos.y = ballSize / 2;
          }

          // Check paddle collision - adjusted for square ball
          const paddleTop = gameHeight - paddleHeight - 5;
          if (
            newPos.y + ballSize / 2 >= paddleTop &&
            newPos.y - ballSize / 2 <= paddleTop + paddleHeight &&
            newPos.x >= paddlePosition - paddleWidth / 2 &&
            newPos.x <= paddlePosition + paddleWidth / 2 &&
            prevVel.y > 0
          ) {
            newVel.y = -Math.abs(newVel.y);
            newPos.y = paddleTop - ballSize / 2;

            // Add some horizontal velocity based on where ball hits paddle
            const hitPosition = (newPos.x - paddlePosition) / (paddleWidth / 2);
            newVel.x += hitPosition * 200;
            setBounceCount((prev) => prev + 1);
          }

          // Ball falls off bottom - reset
          if (newPos.y > gameHeight) {
            resetGame();
            return prevVel;
          }

          return newVel;
        });

        return newPos;
      });

      animationRef.current = requestAnimationFrame(updateGame);
    };

    if (gameStarted) {
      animationRef.current = requestAnimationFrame(updateGame);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [
    gameStarted,
    ballVelocity,
    paddlePosition,
    paddleWidth,
    paddleHeight,
    gameHeight,
    ballSize,
    incrementStat,
    onClose,
    resetGame,
  ]);

  return (
    <div className="flex w-full h-50">
      <Window title="bounce the ball twice to play (+10 happiness)" setIsOpen={onClose}>
        <div className="flex flex-col gap-2 p-2">
          <div
            ref={gameAreaRef}
            className={`relative w-full h-40 bg-zinc-50 border-2 overflow-hidden ${gameStarted ? "cursor-none" : "cursor-pointer"}`}
            onMouseMove={handleMouseMove}
            onClick={!gameStarted ? startGame : undefined}
          >
            {!gameStarted ? (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-400 bg-opacity-20">
                <button
                  className="border-2 bg-white hover:bg-zinc-100 px-3 py-1"
                  onClick={startGame}
                >
                  click to play
                </button>
              </div>
            ) : (
              <>
                {/* Pet as bouncing ball */}
                {petSprite && (
                  <Image
                    src={petSprite}
                    alt="birb"
                    width={100}
                    height={100}
                    className="absolute transition-none no-drag"
                    style={{
                      left: `${ballPosition.x}%`,
                      top: `${ballPosition.y}%`,
                      width: `${ballSize}%`,
                      transform: `translate(-50%, -50%) scaleX(${ballVelocity.x > 0 ? 1 : -1})`,
                    }}
                  />
                )}

                {/* Paddle */}
                <div
                  className="absolute pointer-events-none bg-zinc-800 rounded-sm"
                  style={{
                    left: `${paddlePosition}%`,
                    bottom: `${paddleHeight + 2}%`,
                    width: `${paddleWidth}%`,
                    height: `${paddleHeight}%`,
                    transform: "translateX(-50%)",
                  }}
                />
              </>
            )}
          </div>
          <div className="flex justify-between items-center">
            <p className="text-zinc-600">bounces: {bounceCount}/2</p>
            <p className="text-zinc-600">
              {gameStarted && "move mouse to control paddle"}
            </p>
          </div>
        </div>
      </Window>
    </div>
  );
}
