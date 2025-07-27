import { ReactNode } from "react";

interface CertificateProps {
  children: ReactNode;
}

export default function Certificate({ children }: CertificateProps) {
  return (
    <div className="w-full h-full p-3">
      {/* corner decorations */}
      <div className="absolute inset-x-4 inset-y-12 pointer-events-none">
        <div className="flex justify-between absolute top-0 left-0 right-0">
          <div className="absolute -top-2 -left-2 w-6 h-6 border-r-2 border-b-2 border-zinc-800"></div>
          <div className="absolute -top-2 -right-2 w-6 h-6 border-l-2 border-b-2 border-zinc-800"></div>
        </div>
        <div className="flex justify-between absolute bottom-[-27px] left-0 right-0">
          <div className="absolute -bottom-2 -left-2 w-6 h-6 border-t-2 border-r-2 border-zinc-800"></div>
          <div className="absolute -bottom-2 -right-2 w-6 h-6 border-t-2 border-l-2 border-zinc-800"></div>
        </div>
      </div>

      {/* official seal */}
      <div className="fixed top-10 p-4 opacity-50">
        <div className="border border-zinc-800 rounded-full p-1">
          <div className="w-24 h-24 flex items-center justify-center border border-zinc-400 rounded-full">
            <span className="text-2xl tracking-widest rotate-45">official</span>
          </div>
        </div>
      </div>

      {/* content box */}
      <div className="w-full h-full border-2 border-zinc-800 p-4 flex-1 overflow-y-auto">
        <div>{children}</div>
      </div>
    </div>
  );
}
