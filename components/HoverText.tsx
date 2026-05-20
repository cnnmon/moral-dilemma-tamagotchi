import { useEffect, useState } from "react";

// check if it's a mobile device
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// split text into parts so +tokens/-tokens (e.g. "+hunger", "-poo") can be colored.
// lookbehind ensures we only match tokens at start of string or after space/comma/paren,
// so hyphens inside words like "self-sacrificing" aren't treated as negative tokens.
const TOKEN_RE = /((?<=^|[\s(,])[+-][\w-]+)/g;

const renderHoverText = (text: string) =>
  text.split(TOKEN_RE).map((part, i) => {
    if (part.startsWith("+"))
      return (
        <span key={i} className="text-[#3493DC]">
          {part}
        </span>
      );
    if (part.startsWith("-"))
      return (
        <span key={i} className="text-red-500">
          {part}
        </span>
      );
    return part;
  });

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

  // don't render on mobile devices
  if (isMobile) {
    return null;
  }

  return (
    <>
      {hoverText && (
        <p
          className="fixed z-[999] pointer-events-none px-2 border-2 bg-zinc-100 flex justify-center items-center"
          style={{
            top: mousePosition.y,
            left: mousePosition.x,
            transform: "translate(10px, 10px)",
          }}
        >
          {renderHoverText(hoverText)}
        </p>
      )}
    </>
  );
}
