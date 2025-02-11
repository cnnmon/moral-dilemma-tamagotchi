"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { useState, useEffect } from "react";

interface OutcomePopupProps {
  message: string;
  pet: Doc<"pets">;
  onClose: () => void;
  exitable: boolean;
}

export function OutcomePopup({
  message,
  pet,
  onClose,
  exitable,
}: OutcomePopupProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    return () => setVisible(false);
  }, []);

  const animationClasses = visible
    ? "opacity-100 scale-100"
    : "opacity-0 scale-90";

  if (!exitable)
    return (
      <div className="w-full border-2 border-black p-4 relative mb-4 bg-gray-100">
        <p className="font-pixel">
          {pet.name} looks up at you inquisitively. &quot;{message}&quot;
        </p>
      </div>
    );

  return (
    <div
      className={`w-full border-2 border-black p-4 relative mb-4 bg-gray-100 transition-all duration-500 transform ${animationClasses}`}
    >
      {exitable && (
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onClose, 500); // delay onClose to allow fade-out
          }}
          className="absolute top-1 right-1 hover:opacity-70"
        >
          ✕
        </button>
      )}
      <p className="font-pixel pr-6">{message}</p>
    </div>
  );
}
