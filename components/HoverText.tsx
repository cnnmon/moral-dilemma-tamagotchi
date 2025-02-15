import { useEffect, useState } from "react";
import Image from "next/image";
import { ObjectKey, OBJECTS } from "@/constants/objects";

export default function HoverText({
  hoverText,
  cursorObject,
}: {
  hoverText: string | null;
  cursorObject?: ObjectKey | null;
}) {
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

  return (
    <div className="z-40 pointer-events-none">
      {cursorObject && (
        <Image
          src={OBJECTS[cursorObject]}
          alt={cursorObject}
          className="absolute z-50"
          width={50}
          height={50}
          style={{
            top: mousePosition.y,
            left: mousePosition.x,
            transform: "translate(-20px, -20px)",
            pointerEvents: "none",
          }}
        />
      )}
      {hoverText && (
        <p
          className="absolute px-2 border-2 bg-zinc-100 flex justify-center items-center"
          style={{
            top: mousePosition.y,
            left: mousePosition.x,
            transform: "translate(10px, 10px)",
            pointerEvents: "none",
          }}
        >
          {hoverText}
        </p>
      )}
    </div>
  );
}
