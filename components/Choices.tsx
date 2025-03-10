export default function Choices({
  dilemmaText,
  choices,
  disabled = false,
  selectedChoice,
  setSelectedChoice,
}: {
  dilemmaText?: string;
  choices: { text: string }[];
  disabled?: boolean;
  selectedChoice: number | null;
  setSelectedChoice: (choice: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {dilemmaText && <p>{dilemmaText}</p>}
      <div className="flex flex-col gap-1">
        {choices.map((choice, index) => (
          <button
            key={index}
            className="group relative w-full transition-all underline underline-offset-2 h-8"
            style={{
              opacity: selectedChoice === index ? 1 : 0.5,
              backgroundColor:
                selectedChoice === index ? "black" : "transparent",
              color: selectedChoice === index ? "white" : "black",
            }}
            disabled={disabled}
            onClick={() => setSelectedChoice(index)}
          >
            <span
              className={`absolute left-0 top-1/2 -translate-y-1/2 opacity-0 transition-opacity pl-1 group-hover:opacity-100 ${selectedChoice === index ? "opacity-100" : ""}`}
            >
              &gt;
            </span>
            <span>{choice.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
