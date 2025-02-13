import { useEffect, useState } from "react";

export default function HoverText({ hoverText }: { hoverText: string | null }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent): void => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  if (!hoverText) {
    return null;
  }

  return (
    <div
      key={hoverText}
      className="absolute px-2 border-2 bg-zinc-100 flex justify-center items-center"
      style={{
        top: mousePosition.y,
        left: mousePosition.x,
        transform: "translate(10px, 10px)",
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      <p>{hoverText}</p>
    </div>
  );
}
