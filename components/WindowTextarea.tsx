import Window from "./Window";
import { Textarea } from "./Textarea";

export default function WindowTextarea({
  title,
  isOpen,
  setIsOpen,
  isTextareaOpen,
  placeholder,
  handleSubmit,
  children,
  isDisabled,
  exitable = true,
}: {
  title: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isTextareaOpen: boolean;
  placeholder: string;
  handleSubmit: (response: string) => void;
  isDisabled: boolean;
  children: React.ReactNode;
  exitable?: boolean;
}) {
  return (
    <>
      <Window
        exitable={exitable}
        title={title}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        {children}
      </Window>
      <div className="fixed bottom-0 left-0 w-full flex justify-center items-center pointer-events-none">
        <div
          className="w-full max-w-2xl p-8 transition-all duration-300"
          style={{
            opacity: isOpen && isTextareaOpen ? 1 : 0,
            transform:
              isOpen && isTextareaOpen ? "translateY(0)" : "translateY(-5px)",
          }}
        >
          <Textarea
            placeholder={placeholder}
            handleSubmit={(response) => handleSubmit(response)}
            isDisabled={isDisabled}
          />
        </div>
      </div>
    </>
  );
}
