import { useEffect, useState } from "react";
import Image from "next/image";
import { ObjectKey, OBJECTS } from "@/constants/objects";

// check if it's a mobile device
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

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

  // don't render on mobile devices
  if (isMobile) {
    return null;
  }

  return (
    <div className="z-40 pointer-events-none">
      {cursorObject && (
        <Image
          src={OBJECTS[cursorObject]}
          alt={cursorObject}
          className="absolute"
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
