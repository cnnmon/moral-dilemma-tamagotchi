export default function Window({
  title,
  children,
  isOpen = true,
  setIsOpen,
  exitable = true,
}: {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  exitable?: boolean;
}) {
  return (
    <div
      className="w-full border-2 border-black bg-zinc-100 transition-all duration-300 h-fit text-lg"
      style={{
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? "auto" : "none",
        transform: isOpen ? "translateY(0)" : "translateY(-20px)",
      }}
    >
      <div className="flex justify-between items-center border-b-2 border-black">
        <p className="px-3 py-1">{title}</p>
        {setIsOpen && exitable && (
          <button
            onClick={() => {
              setIsOpen(false);
            }}
            className="hover:opacity-70 w-5 h-5"
          >
            ✕
          </button>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}
