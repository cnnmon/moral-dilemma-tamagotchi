import { useEffect, useState } from "react";

const thinkingFlavorText = ["thinking...", "chewing on it...", "pondering..."];

export function Textarea({
  placeholder,
  handleSubmit,
  isDisabled = false,
  isSubmitting = false,
}: {
  placeholder: string;
  handleSubmit: (response: string) => void;
  isDisabled?: boolean;
  isSubmitting?: boolean;
}) {
  const [value, setValue] = useState("");
  const [flavorTextIndex, setFlavorTextIndex] = useState(0);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(value);
    }
  };

  // rotate thinking flavor text every second
  useEffect(() => {
    if (isSubmitting) {
      const intervalId = setInterval(() => {
        setFlavorTextIndex(
          (prevIndex) => (prevIndex + 1) % thinkingFlavorText.length
        );
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [isSubmitting]);

  return (
    <div className="w-full mt-2">
      <textarea
        className={`w-full resize-none border-2 border-black bg-zinc-200 outline-none p-2 ${
          isDisabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyPress}
        disabled={isDisabled}
        placeholder={placeholder}
      />
      <div className="flex justify-end w-full">
        <p className="text-zinc-400 text-sm mt-[-32px] pr-2 pb-2">
          {!isSubmitting ? (
            <>enter to submit</>
          ) : (
            <span className="opacity-50 cursor-not-allowed pointer-events-none">
              {thinkingFlavorText[flavorTextIndex]}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
