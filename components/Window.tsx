export default function Window({
  title,
  children,
  isOpen = true,
  setIsOpen,
}: {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}) {
  return (
    <div
      className="w-full border-2 border-black bg-zinc-100 transition-all duration-300 h-fit"
      style={{
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? "translateY(0)" : "translateY(-20px)",
      }}
    >
      <div className="flex justify-between items-center border-b-2 border-black">
        <p className="px-3 py-1">{title}</p>
        {setIsOpen && (
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
      <div className="px-3 py-2 pb-4">{children}</div>
    </div>
  );
}
