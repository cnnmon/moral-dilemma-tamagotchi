"use client";

import { useState, useEffect } from "react";

interface OutcomePopupProps {
  message: string;
  onClose: () => void;
  exitable: boolean;
}

export function OutcomePopup({
  message,
  onClose,
  exitable,
}: OutcomePopupProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    setTimeout(onClose, 5000);
    return () => {
      setVisible(false);
    };
  }, [onClose]);

  const animationClasses = visible
    ? "opacity-100 scale-100"
    : "opacity-0 scale-90";

  return (
    <div
      className={`w-full border-2 border-black p-4 relative mb-4 bg-zinc-100 transition-all duration-200 transform ${animationClasses}`}
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
      <p className={`font-pixel ${exitable ? "pr-6" : ""}`}>{message}</p>
    </div>
  );
}
