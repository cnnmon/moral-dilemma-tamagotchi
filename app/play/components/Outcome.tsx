"use client";

interface OutcomePopupProps {
  message: string;
  onClose: () => void;
}

export function OutcomePopup({ message, onClose }: OutcomePopupProps) {
  return (
    <div className="w-full bg-white border-2 border-black p-4 relative mb-4">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 hover:opacity-70"
      >
        ✕
      </button>
      <p className="font-pixel pr-6">{message}</p>
    </div>
  );
}
