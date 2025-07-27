import { useEffect } from "react";
import Loading from "./play/components/Loading";

export default function HomePage() {
  useEffect(() => {
    window.location.href = "/play";
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loading />
    </div>
  );
}
