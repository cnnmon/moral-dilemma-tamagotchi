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
  if (!isOpen) {
    return null;
  }

  return (
    <div className="w-full border-2 border-black bg-zinc-100">
      <div className="flex justify-between items-center border-b-2 border-black">
        <p className="px-3 py-1">{title}</p>
        {setIsOpen && (
          <button
            onClick={() => {
              setIsOpen(false);
            }}
            className="hover:opacity-70"
          >
            ✕
          </button>
        )}
      </div>
      <div className="px-3 py-2">{children}</div>
    </div>
  );
}
