import React from "react";
import Image from "next/image";

const VIEWPORT_WIDTH = 570;
const VIEWPORT_HEIGHT = 230;

const Viewport = React.memo(function Viewport() {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: VIEWPORT_WIDTH,
        height: VIEWPORT_HEIGHT,
        zIndex: -5,
      }}
      className="flex items-center justify-center"
    >
      <Image
        src="/birb_smol.gif"
        alt="birb"
        width={150}
        height={150}
        unoptimized
        className="absolute mt-10 z-10"
      />
      <Image
        src="/background.png"
        alt="background"
        width={VIEWPORT_WIDTH}
        height={VIEWPORT_HEIGHT}
        style={{
          maxWidth: VIEWPORT_WIDTH,
          width: "100%",
          height: VIEWPORT_HEIGHT,
          objectFit: "cover",
        }}
        className="absolute"
        unoptimized
      />
      <Image
        src="/trees.gif"
        alt="trees"
        width={VIEWPORT_WIDTH}
        height={VIEWPORT_HEIGHT}
        style={{
          maxWidth: VIEWPORT_WIDTH,
          width: "100%",
          height: VIEWPORT_HEIGHT,
          objectFit: "cover",
        }}
        className="absolute"
        unoptimized
      />
    </div>
  );
});

export default Viewport;
