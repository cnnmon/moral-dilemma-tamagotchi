import { Suspense } from "react";
import Scrapbook from "./components/Scrapbook";

export default function ScrapbookPage() {
  return (
    <div className="flex flex-col items-center justify-center p-4 pt-[20%] sm:w-3xl w-full min-h-screen">
      <div className="flex flex-col items-center mb-8">
        <p className="text-3xl font-bold mb-2">family scrapbook</p>
        <p className="text-zinc-600 text-center max-w-lg">
          a collection of all your graduated pets and their memories - click on
          a pet to see their graduation certificate
        </p>
      </div>

      {/* scrapbook content */}
      <Suspense
        fallback={
          <div className="text-center p-8">loading your pet memories...</div>
        }
      >
        <Scrapbook />
      </Suspense>
    </div>
  );
}
