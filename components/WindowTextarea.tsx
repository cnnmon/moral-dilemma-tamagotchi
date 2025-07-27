import Window from "./Window";
import { Textarea } from "./Textarea";

export default function WindowTextarea({
  title,
  placeholder,
  handleSubmit,
  children,
  exitable = true,
  disabled = false,
}: {
  title: string;
  placeholder: string;
  handleSubmit: (response: string) => void;
  children: React.ReactNode;
  exitable?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <Window exitable={exitable} title={title}>
        <div className="flex flex-col gap-2 p-3">
          {children}
          <div
            className="w-full sm:max-w-2xl transition-all duration-300"
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
