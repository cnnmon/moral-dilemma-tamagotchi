import { useCallback, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

const thinkingFlavorText = ["thinking...", "chewing on it...", "pondering..."];
const MAX_LENGTH = 120;

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

  const handleEnter = useCallback(() => {
    handleSubmit(value);
  }, [value, handleSubmit]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEnter();
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
    <div className="flex flex-col gap-2">
      <textarea
        className={twMerge(
          `w-full h-24 resize-none border-2 border-black bg-zinc-200 outline-none p-2 pointer-events-auto`,
          isDisabled && "opacity-50 cursor-not-allowed"
        )}
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
      <div className="flex justify-between w-full text-zinc-400 mt-[-35px] px-2">
        <p className="text-[16px]">
          {value.length}/{MAX_LENGTH}
        </p>
      </div>

      <p className="text-right text-zinc-400 mt-[-35px] px-3 mb-2 text-[16px]">
        {!isSubmitting ? (
          <span>
            press enter to{" "}
            <a
              className="underline"
              style={{
                opacity: value.length === 0 ? 0.5 : 1,
                pointerEvents: value.length === 0 ? "none" : "auto",
              }}
              onClick={handleEnter}
            >
              submit
            </a>
          </span>
        ) : (
          <span className="opacity-50 cursor-not-allowed pointer-events-none">
            {thinkingFlavorText[flavorTextIndex]}
          </span>
        )}
      </p>
    </div>
  );
}
