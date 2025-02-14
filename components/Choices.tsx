import { Textarea } from "./Textarea";

export default function Choices({
  dilemmaText,
  choices,
  placeholderText = "why?",
  handleSubmit,
  disabled = false,
  selectedChoice,
  setSelectedChoice,
}: {
  dilemmaText: string;
  choices: { text: string }[];
  placeholderText?: string;
  handleSubmit: (response: string) => void;
  disabled?: boolean;
  selectedChoice: number | null;
  setSelectedChoice: (choice: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <p>{dilemmaText}</p>
      {choices.map((choice, index) => (
        <a
          key={index}
          style={{
            opacity: selectedChoice !== null ? 0.5 : 1,
            backgroundColor: selectedChoice === index ? "black" : undefined,
            color: selectedChoice === index ? "white" : undefined,
            cursor: selectedChoice !== null ? "not-allowed" : "pointer",
            pointerEvents: selectedChoice !== null ? "none" : "auto",
          }}
          onClick={() => {
            if (selectedChoice !== null && selectedChoice !== index) {
              return;
            }

            if (selectedChoice === null) {
              setSelectedChoice(index);
            }
          }}
        >
          <span>{choice.text}</span>
        </a>
      ))}
      {selectedChoice !== null && (
        <Textarea
          placeholder={placeholderText}
          handleSubmit={(response) => handleSubmit(response)}
          isDisabled={disabled}
        />
      )}
    </div>
  );
}
