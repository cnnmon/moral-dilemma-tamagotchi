export default function Window({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full border-2 border-black bg-zinc-100">
      <div className="flex flex-col px-3 py-1 border-b-2 border-black">
        <p>{title}</p>
      </div>
      <div className="px-3 py-2">{children}</div>
    </div>
  );
}
