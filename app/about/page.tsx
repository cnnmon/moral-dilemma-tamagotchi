import Image from "next/image";
import Menu from "@/components/Menu";
import Window from "@/components/Window";

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-0 sm:w-xl w-full">
      <Menu page="about" />
      <Window title="about" isOpen={true}>
        <div className="flex flex-col gap-2">
          <Image
            src="/poo.gif"
            alt="princi(pal)"
            width={50}
            height={50}
            className="rounded-full"
          />
          <p>thanks for playing~</p>
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
            by <a href="https://tiffanywang.me/">tiff</a>
            <br />
            big thanks to gavin for dilemma writing help—
            <a href="https://x.com/garvin_laughri">
              he pinky promises to write more often
            </a>
          </p>
        </div>
      </Window>
    </div>
  );
}
