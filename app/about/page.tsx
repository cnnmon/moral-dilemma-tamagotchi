"use client";
import Menu from "@/components/Menu";
import Window from "@/components/Window";

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-0 sm:w-xl w-full">
      <Menu />
      <Window title="about">
        <div className="flex flex-col gap-2">
          <p>work in progress as of feb 15!</p>
          <p>
            princi/pal is a moral dilemma tamagotchi. it&apos;s a simple game
            where you raise a pet, make decisions, and watch it evolve.
          </p>
          <p>
            made with moral uncertainty by{" "}
            <a href="https://tiffanywang.me/">tiffany</a>
          </p>
          <p className="flex gap-2">
            <a href="https://github.com/cnnmon/moral-dilemma-tamagotchi">
              github
            </a>
            <a href="https://cnnmon.itch.io/">more games</a>
          </p>
        </div>
      </Window>
    </div>
  );
}
