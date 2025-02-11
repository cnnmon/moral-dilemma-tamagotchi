"use client";

import { Doc } from "@/convex/_generated/dataModel";

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
  if (!exitable)
    return (
      <div className="w-full border-2 border-black p-4 relative mb-4 bg-gray-100">
        <p className="font-pixel">
          {pet.name} looks up at you inquisitively. &quot;{message}&quot;
        </p>
      </div>
    );

  return (
    <div className="w-full border-2 border-black p-4 relative mb-4 bg-gray-100">
      {exitable && (
        <button
          onClick={onClose}
          className="absolute top-1 right-1 hover:opacity-70"
        >
          ✕
        </button>
      )}
      <p className="font-pixel pr-2">{message}</p>
    </div>
  );
}
