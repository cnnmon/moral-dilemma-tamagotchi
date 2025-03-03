"use client";

import Window from "@/components/Window";

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-0 sm:w-xl w-full">
      <Window title="about">
        <div className="flex flex-col gap-2">
          <p>thanks for playing~</p>
          <p>[as of mar 2: work in progress, give me feedback!]</p>
          <p>
            princi(pal) is a moral dilemma tamagotchi. it&apos;s a virtual pet
            game where you can (finally!) impose your own ethical views on said
            pet and watch the consequences unfold
          </p>
          <p>
            made with{" "}
            <a href="https://github.com/cnnmon/moral-dilemma-tamagotchi">
              moral uncertainty
            </a>{" "}
            by <a href="https://tiffanywang.me/">chadd</a>
            <br />
            big thanks to gavin for dilemma writing help (*ˊᵕˋ)
          </p>
        </div>
      </Window>
    </div>
  );
}
