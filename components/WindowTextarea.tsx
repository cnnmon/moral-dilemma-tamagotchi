import Window from "./Window";
import { Textarea } from "./Textarea";

export default function WindowTextarea({
  title,
  placeholder,
  handleSubmit,
  children,
  exitable = true,
  disabled = false,
  setIsOpen,
}: {
  title: string;
  placeholder: string;
  handleSubmit: (response: string) => void;
  children: React.ReactNode;
  exitable?: boolean;
  disabled?: boolean;
  setIsOpen?: () => void;
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <Window exitable={exitable} title={title} setIsOpen={setIsOpen}>
        <div className="flex flex-col gap-2 p-3">
          {children}
          <div
            className="w-full"
            style={{
              opacity: 1,
              transform: "translateY(0)",
            }}
          >
            <Textarea
              placeholder={placeholder}
              handleSubmit={(response) => handleSubmit(response)}
              isDisabled={disabled}
            />
          </div>
        </div>
      </Window>
    </div>
  );
}
