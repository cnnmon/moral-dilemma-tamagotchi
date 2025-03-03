import { useEffect, useState } from "react";

const thinkingFlavorText = ["thinking...", "chewing on it...", "pondering..."];
const MAX_LENGTH = 280;

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
    <>
      <textarea
        className={`w-full resize-none border-2 border-black bg-zinc-200 outline-none p-2 pointer-events-auto ${
          isDisabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        value={value}
        onChange={(e) => {
          if (e.target.value.length <= MAX_LENGTH) {
            setValue(e.target.value);
          }
        }}
        onKeyDown={handleKeyPress}
        disabled={isDisabled}
        placeholder={placeholder}
        maxLength={MAX_LENGTH}
      />
      <div className="flex justify-between w-full text-zinc-400 text-xs mt-[-28px] px-2">
        <p>
          {value.length}/{MAX_LENGTH}
        </p>
        <p>
          {!isSubmitting ? (
            <span>enter to submit</span>
          ) : (
            <span className="opacity-50 cursor-not-allowed pointer-events-none">
              {thinkingFlavorText[flavorTextIndex]}
            </span>
          )}
        </p>
      </div>
    </>
  );
}
