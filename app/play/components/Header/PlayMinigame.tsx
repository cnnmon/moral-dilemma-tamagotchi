import Window from "@/components/Window";
import { useBaseStats } from "@/app/providers/PetProvider";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

export default function PlayMinigame({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const { incrementStat } = useBaseStats();
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  const [ballPosition, setBallPosition] = useState({ x: 50, y: 50 });
  const [ballVelocity, setBallVelocity] = useState({ x: 1, y: 1 });
  const [paddlePosition, setPaddlePosition] = useState(50);
  const [bounceCount, setBounceCount] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const gameWidth = 100; // percentage
  const gameHeight = 100; // percentage
  const paddleWidth = 20; // percentage
  const paddleHeight = 3; // percentage
  const ballSize = 12; // percentage

  const resetGame = useCallback(() => {
    setBallPosition({ x: 50, y: 20 });
    setBallVelocity({ x: (Math.random() - 0.5) * 1.5, y: 1 });
    setBounceCount(0);
    setGameStarted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      resetGame();
    }
  }, [isOpen, resetGame]);

  // Handle game completion when bounceCount reaches 2
  useEffect(() => {
    if (bounceCount >= 2) {
      incrementStat(
        "happiness" as keyof import("@/constants/base").BaseStatsType
      );
      setIsOpen(false);
    }
  }, [bounceCount, incrementStat, setIsOpen]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!gameAreaRef.current) return;
      const rect = gameAreaRef.current.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
      setPaddlePosition(
        Math.max(paddleWidth / 2, Math.min(100 - paddleWidth / 2, mouseX))
      );
    },
    [paddleWidth]
  );

  const startGame = () => {
    setGameStarted(true);
  };

  useEffect(() => {
    if (!gameStarted || !isOpen) return;

    const updateGame = () => {
      setBallPosition((prevPos) => {
        const newPos = {
          x: prevPos.x + ballVelocity.x,
          y: prevPos.y + ballVelocity.y,
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
              Math.min(gameWidth - ballSize / 2, newPos.x)
            );
          }

          // Bounce off top wall
          if (newPos.y <= ballSize / 2) {
            newVel.y = -newVel.y;
            newPos.y = ballSize / 2;
          }

          // Check paddle collision
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
            newVel.x += hitPosition * 0.5;

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
    isOpen,
    ballVelocity,
    paddlePosition,
    paddleWidth,
    paddleHeight,
    gameHeight,
    ballSize,
    incrementStat,
    setIsOpen,
    resetGame,
  ]);

  if (!isOpen) return null;

  return (
    <div className="flex w-full h-50">
      <Window
        title="bounce the ball twice to play!"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <div className="flex flex-col gap-2 p-2">
          <div
            ref={gameAreaRef}
            className="relative w-full h-40 bg-zinc-50 border-2 cursor-none overflow-hidden"
            onMouseMove={handleMouseMove}
            onClick={!gameStarted ? startGame : undefined}
          >
            {!gameStarted ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={startGame}
                >
                  Start Game
                </button>
              </div>
            ) : (
              <>
                {/* Ball */}
                <Image
                  src="/actions/play.png"
                  alt="ball"
                  width={100}
                  height={100}
                  className="absolute rounded-full transition-none"
                  style={{
                    left: `${ballPosition.x}%`,
                    top: `${ballPosition.y}%`,
                    width: `${ballSize}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                />

                {/* Paddle */}
                <div
                  className="absolute bg-blue-500"
                  style={{
                    left: `${paddlePosition}%`,
                    bottom: "5%",
                    width: `${paddleWidth}%`,
                    height: `${paddleHeight}%`,
                    transform: "translateX(-50%)",
                  }}
                />
              </>
            )}
          </div>
          <div className="flex justify-between items-center">
            <p className="text-zinc-600">Bounces: {bounceCount}/2</p>
            <p className="text-zinc-600">
              {gameStarted && "Move mouse to control paddle"}
            </p>
          </div>
        </div>
      </Window>
    </div>
  );
}
